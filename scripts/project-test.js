#!/usr/bin/env node
"use strict";

const fs = require("fs");
const http = require("http");
const net = require("net");
const path = require("path");
const { spawn, spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const PUBLIC_DIR = path.join(ROOT, "public");
const PAGES_DIR = path.join(PUBLIC_DIR, "pages");
const SQL_DIR = path.join(SRC_DIR, "infra", "init");
const SEED_DIR = path.join(SQL_DIR, "seed-data");
const DOCS_DIR = path.join(ROOT, "docs");

const TEXT_EXTENSIONS = new Set([
  ".css",
  ".csv",
  ".ejs",
  ".html",
  ".js",
  ".json",
  ".md",
  ".sql",
  ".txt",
]);

const ASSET_EXTENSIONS = new Set([
  ".gif",
  ".ico",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
]);

const REQUIRED_RUNTIME_ENV = [
  "POSTGRES_HOST",
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_DB",
  "POSTGRES_PORT",
  "JWT_SECRET",
  "DEFAULT_EXPIRES_IN_SECONDS",
];

const REQUIRED_PROJECT_PATHS = [
  "package.json",
  "package-lock.json",
  "README.md",
  "src/server.js",
  "src/routes/index.js",
  "src/database/db.js",
  "src/infra/run-sql.js",
  "src/infra/init/seed-data/modulos.csv",
  "src/infra/init/seed-data/questoes.csv",
  "public/pages/index.ejs",
  "public/pages/not-found.ejs",
  "public/assets/css/main.css",
  "public/js/main.js",
];

const useColor = !process.env.NO_COLOR && (process.stdout.isTTY || process.env.FORCE_COLOR);
const colorCodes = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const marks = {
  pass: "✓",
  fail: "✗",
  warn: "!",
  info: "•",
};

const checks = [];
const state = {
  failed: 0,
  passed: 0,
  results: [],
  warnings: [],
};

const renderedPagesCache = { value: null };
const projectFilesCache = { value: null };

primeTestEnv();
registerChecks();

run().catch(function (error) {
  console.error(color("red", error.stack || error.message));
  process.exitCode = 1;
});

function registerChecks() {
  check("Setup", "package.json, lockfile e dependencias", function () {
    const pkg = readJson(path.join(ROOT, "package.json"));
    const lock = readJson(path.join(ROOT, "package-lock.json"));
    const expectedScripts = ["start", "dev", "db:init", "test"];
    const missingScripts = expectedScripts.filter(function (script) {
      return !pkg.scripts || !pkg.scripts[script];
    });

    assert(
      missingScripts.length === 0,
      "Scripts npm obrigatorios ausentes.",
      missingScripts.map(function (script) {
        return `package.json precisa de scripts.${script}`;
      }),
    );

    assert(
      pkg.scripts.test === "node ./scripts/project-test.js",
      "O atalho npm run test nao aponta para o runner V3.",
      [`scripts.test atual: ${pkg.scripts.test || "(ausente)"}`],
    );

    const declaredDeps = pkg.dependencies || {};
    const lockRootDeps = lock.packages && lock.packages[""] && lock.packages[""].dependencies
      ? lock.packages[""].dependencies
      : {};
    const lockProblems = [];

    for (const [dependency, version] of Object.entries(declaredDeps)) {
      if (lockRootDeps[dependency] !== version) {
        lockProblems.push(
          `${dependency}: package.json=${version}, package-lock=${lockRootDeps[dependency] || "(ausente)"}`,
        );
      }
    }

    assert(
      lockProblems.length === 0,
      "package-lock.json nao esta sincronizado com package.json.",
      lockProblems,
    );

    const missingDeps = Object.keys(declaredDeps).filter(function (dependency) {
      try {
        require.resolve(dependency, { paths: [ROOT] });
        return false;
      } catch (_error) {
        return true;
      }
    });

    assert(
      missingDeps.length === 0,
      "Dependencias declaradas nao foram encontradas em node_modules.",
      missingDeps.map(function (dependency) {
        return `Rode npm install para instalar ${dependency}`;
      }),
    );

    warnMissingRuntimeEnv();

    return `${expectedScripts.length} scripts, ${Object.keys(declaredDeps).length} deps`;
  });

  check("Setup", "estrutura obrigatoria do projeto", function () {
    const missing = REQUIRED_PROJECT_PATHS.filter(function (relativePath) {
      return !fs.existsSync(path.join(ROOT, relativePath));
    });

    assert(
      missing.length === 0,
      "Arquivos essenciais do projeto nao foram encontrados.",
      missing,
    );

    return `${REQUIRED_PROJECT_PATHS.length} caminhos essenciais`;
  });

  check("Setup", "inventario de arquivos reconhecidos", function () {
    const files = getProjectFiles();
    const unknown = [];
    const empty = [];

    for (const file of files) {
      const basename = path.basename(file);
      const extension = path.extname(file).toLowerCase();
      const stat = fs.statSync(file);

      if (stat.size === 0) empty.push(rel(file));

      if (
        TEXT_EXTENSIONS.has(extension) ||
        ASSET_EXTENSIONS.has(extension) ||
        basename === ".env" ||
        basename === ".gitignore" ||
        basename === "package-lock.json" ||
        basename === "package.json"
      ) {
        continue;
      }

      unknown.push(rel(file));
    }

    assert(
      empty.length === 0,
      "Arquivos vazios encontrados no projeto.",
      compactDetails(empty),
    );

    assert(
      unknown.length === 0,
      "Arquivos com extensao ainda nao coberta pelo runner.",
      compactDetails(unknown),
    );

    return `${files.length} arquivos`;
  });

  check("Setup", "arquivos texto sem conflito de merge", function () {
    const textFiles = getProjectFiles().filter(isTextLikeFile);
    const conflicts = [];

    for (const file of textFiles) {
      if (/^(<<<<<<<|=======|>>>>>>>)\s/m.test(readText(file))) {
        conflicts.push(rel(file));
      }
    }

    assert(
      conflicts.length === 0,
      "Marcadores de conflito de merge encontrados.",
      conflicts,
    );

    return `${textFiles.length} arquivos texto`;
  });

  check("Setup", "JSON valido", function () {
    const jsonFiles = getProjectFiles().filter(function (file) {
      return path.extname(file).toLowerCase() === ".json";
    });
    const failures = [];

    for (const file of jsonFiles) {
      try {
        readJson(file);
      } catch (error) {
        failures.push(`${rel(file)}: ${error.message}`);
      }
    }

    assert(failures.length === 0, "JSON invalido encontrado.", failures);

    return `${jsonFiles.length} arquivos JSON`;
  });

  check("Backend", "sintaxe JavaScript", function () {
    const jsFiles = getProjectFiles()
      .filter(function (file) {
        return path.extname(file).toLowerCase() === ".js";
      })
      .sort();
    const failures = [];

    for (const file of jsFiles) {
      const result = spawnSync(process.execPath, ["--check", file], {
        cwd: ROOT,
        encoding: "utf8",
      });

      if (result.status !== 0) {
        failures.push(formatProcessFailure(file, result));
      }
    }

    assert(
      failures.length === 0,
      "Algum JavaScript nao passa no parser do Node.",
      failures,
    );

    return `${jsFiles.length} arquivos JS`;
  });

  check("Backend", "imports CommonJS sem subir servidor", async function () {
    const importFiles = listFiles(SRC_DIR, isJsFile)
      .filter(function (file) {
        const unixPath = rel(file);
        return unixPath !== "src/server.js" && unixPath !== "src/infra/run-sql.js";
      })
      .sort();
    const failures = [];

    for (const file of importFiles) {
      try {
        withMutedConsole(function () {
          require(file);
        });
      } catch (error) {
        failures.push(`${rel(file)}: ${error.stack || error.message}`);
      }
    }

    await closeDbPoolIfLoaded();

    assert(
      failures.length === 0,
      "Algum modulo do backend quebra ao ser importado.",
      failures,
    );

    return `${importFiles.length} modulos`;
  });

  check("Backend", "contratos de imports e exports CommonJS", async function () {
    const jsFiles = listFiles(SRC_DIR, isJsFile).filter(function (file) {
      return rel(file) !== "src/server.js";
    });
    const failures = [];
    let checked = 0;

    for (const file of jsFiles) {
      const imports = extractDestructuredRequires(file, readText(file));

      for (const item of imports) {
        const resolved = resolveRequireTarget(file, item.target);

        if (!resolved) continue;

        try {
          const exported = withMutedConsole(function () {
            return require(resolved);
          });

          for (const name of item.names) {
            checked += 1;

            if (!exported || !(name in exported)) {
              failures.push(`${rel(file)} importa ${name} de ${item.target}, mas o export nao existe`);
            }
          }
        } catch (error) {
          failures.push(`${rel(file)} nao conseguiu validar ${item.target}: ${error.message}`);
        }
      }
    }

    await closeDbPoolIfLoaded();

    assert(
      failures.length === 0,
      "Algum require destructurado aponta para export inexistente.",
      failures,
    );

    return `${checked} simbolos importados`;
  });

  check("Backend", "rotas Express e views referenciadas", function () {
    const apiRoutes = getApiRoutes();
    const pageRoutes = getServerPageRoutes();
    const failures = [];
    const duplicateApiRoutes = findDuplicates(
      apiRoutes.map(function (route) {
        return `${route.method} ${route.path}`;
      }),
    );
    const duplicatePageRoutes = findDuplicates(
      pageRoutes.map(function (route) {
        return `GET ${route.path}`;
      }),
    );

    for (const duplicate of duplicateApiRoutes) {
      failures.push(`Rota API duplicada: ${duplicate}`);
    }

    for (const duplicate of duplicatePageRoutes) {
      failures.push(`Rota de pagina duplicada: ${duplicate}`);
    }

    for (const route of pageRoutes) {
      if (!fs.existsSync(path.join(PAGES_DIR, `${route.view}.ejs`))) {
        failures.push(`GET ${route.path} renderiza view ausente: ${route.view}.ejs`);
      }
    }

    assert(
      failures.length === 0,
      "Mapa de rotas Express tem duplicidade ou view ausente.",
      failures,
    );

    return `${apiRoutes.length} APIs, ${pageRoutes.length} paginas`;
  });

  check("Backend", "rotas privadas exigem authMiddleware", function () {
    const apiRoutes = getApiRoutes();
    const failures = [];

    for (const route of apiRoutes) {
      const shouldRequireAuth =
        route.path.startsWith("/api/progresso/") ||
        route.path.startsWith("/api/questoes/") ||
        (route.path.startsWith("/api/usuarios/") && route.method !== "POST");

      if (shouldRequireAuth && !route.requiresAuth) {
        failures.push(`${route.method} ${route.path} deveria usar authMiddleware`);
      }
    }

    assert(
      failures.length === 0,
      "Alguma rota privada esta sem authMiddleware.",
      failures,
    );

    return `${apiRoutes.filter(function (route) { return route.requiresAuth; }).length} rotas protegidas`;
  });

  check("Backend", "queries SQL sem interpolacao perigosa", function () {
    const sqlJsFiles = [
      ...listFiles(path.join(SRC_DIR, "repositories"), isJsFile),
      path.join(SRC_DIR, "infra", "run-sql.js"),
    ].filter(function (file) {
      return fs.existsSync(file);
    });
    const failures = [];

    for (const file of sqlJsFiles) {
      const text = readText(file);
      const queryPattern = /(?:pool|client)\.query\(\s*`([\s\S]*?)`/g;
      let match;

      while ((match = queryPattern.exec(text)) !== null) {
        if (match[1].includes("${")) {
          failures.push(`${rel(file)} contem interpolacao dentro de SQL template string`);
        }
      }
    }

    assert(
      failures.length === 0,
      "SQL montado por interpolacao pode abrir brecha e quebrar parametros.",
      failures,
    );

    return `${sqlJsFiles.length} arquivos com SQL`;
  });

  check("Backend", "placeholders SQL parametrizados em ordem", function () {
    const sqlJsFiles = [
      ...listFiles(path.join(SRC_DIR, "repositories"), isJsFile),
      path.join(SRC_DIR, "infra", "run-sql.js"),
    ].filter(function (file) {
      return fs.existsSync(file);
    });
    const failures = [];

    for (const file of sqlJsFiles) {
      const sqlBlocks = extractSqlTemplateStrings(readText(file));

      for (const sql of sqlBlocks) {
        const problem = findSqlPlaceholderProblem(sql);

        if (problem) failures.push(`${rel(file)}: ${problem}`);
      }
    }

    assert(
      failures.length === 0,
      "Alguma query SQL usa placeholders fora da sequencia esperada.",
      failures,
    );

    return `${sqlJsFiles.length} arquivos com SQL`;
  });

  check("Backend", "utilitarios criticos de senha e JWT", function () {
    const { hashPassword, verifyPassword } = require(path.join(
      SRC_DIR,
      "utils",
      "password.js",
    ));
    const { createToken, verifyToken } = withMutedConsole(function () {
      return require(path.join(SRC_DIR, "utils", "jwt.js"));
    });

    const password = "SenhaTeste123";
    const firstHash = hashPassword(password);
    const secondHash = hashPassword(password);

    assert(firstHash.includes(":"), "Hash de senha nao contem salt e hash.");
    assert(firstHash !== secondHash, "Hash de senha deveria usar salt aleatorio.");
    assert(verifyPassword(password, firstHash), "Senha correta nao validou.");
    assert(!verifyPassword("errada", firstHash), "Senha incorreta validou.");
    assert(!verifyPassword(password, "hash-quebrado"), "Hash invalido validou.");

    const token = createToken({ id_usuario: 123, perfil: "teste" });
    const payload = verifyToken(token);

    assert(
      payload.id_usuario === 123 && payload.perfil === "teste",
      "Payload JWT nao volta como foi assinado.",
    );

    return "hash, verify, sign e verify";
  });

  check("Backend", "middleware de autenticacao isola token e usuario", async function () {
    const middlewareFile = path.join(SRC_DIR, "middlewares", "auth.middleware.js");
    const usuariosRepositoryFile = path.join(SRC_DIR, "repositories", "usuarios.repositories.js");
    const { createToken } = withMutedConsole(function () {
      return require(path.join(SRC_DIR, "utils", "jwt.js"));
    });
    const usuariosRepository = require(usuariosRepositoryFile);
    const originalFindUsuarioById = usuariosRepository.findUsuarioById;
    const knownUser = {
      id_usuario: 123,
      nome: "Usuario Teste",
      cpf: "00000000000",
    };
    const failures = [];
    let checked = 0;

    usuariosRepository.findUsuarioById = async function (idUsuario) {
      if (Number(idUsuario) === Number(knownUser.id_usuario)) return knownUser;
      return null;
    };

    delete require.cache[require.resolve(middlewareFile)];

    try {
      const authMiddleware = require(middlewareFile);

      const cases = [
        {
          name: "sem header",
          authorization: undefined,
          expectedStatus: 401,
          expectedNext: false,
        },
        {
          name: "formato invalido",
          authorization: "Token abc",
          expectedStatus: 401,
          expectedNext: false,
        },
        {
          name: "token invalido",
          authorization: "Bearer token-quebrado",
          expectedStatus: 401,
          expectedNext: false,
        },
        {
          name: "usuario inexistente",
          authorization: `Bearer ${createToken({ id_usuario: 999 })}`,
          expectedStatus: 401,
          expectedNext: false,
        },
        {
          name: "usuario valido",
          authorization: `Bearer ${createToken({ id_usuario: knownUser.id_usuario })}`,
          expectedStatus: null,
          expectedNext: true,
        },
      ];

      for (const item of cases) {
        const req = { headers: {}, usuario: null };
        const res = createMockResponse();
        let nextCalled = false;

        if (item.authorization) req.headers.authorization = item.authorization;

        await authMiddleware(req, res, function () {
          nextCalled = true;
        });

        checked += 1;

        if (item.expectedStatus !== null && res.statusCode !== item.expectedStatus) {
          failures.push(`${item.name}: esperado status ${item.expectedStatus}, veio ${res.statusCode}`);
        }

        if (nextCalled !== item.expectedNext) {
          failures.push(`${item.name}: next esperado=${item.expectedNext}, veio=${nextCalled}`);
        }

        if (item.expectedNext && req.usuario !== knownUser) {
          failures.push(`${item.name}: req.usuario nao recebeu o usuario encontrado`);
        }
      }
    } finally {
      usuariosRepository.findUsuarioById = originalFindUsuarioById;
      delete require.cache[require.resolve(middlewareFile)];
      await closeDbPoolIfLoaded();
    }

    assert(
      failures.length === 0,
      "authMiddleware nao respondeu corretamente aos cenarios de token.",
      failures,
    );

    return `${checked} cenarios de auth`;
  });

  check("Frontend", "templates EJS compilam", function () {
    const ejs = require("ejs");
    const ejsFiles = listFiles(PAGES_DIR, function (file) {
      return path.extname(file).toLowerCase() === ".ejs";
    }).sort();
    const failures = [];

    for (const file of ejsFiles) {
      try {
        ejs.compile(readText(file), { filename: file });
      } catch (error) {
        failures.push(`${rel(file)}: ${error.message}`);
      }
    }

    assert(failures.length === 0, "Algum template EJS nao compila.", failures);

    return `${ejsFiles.length} templates`;
  });

  check("Frontend", "views EJS renderizam com partials", async function () {
    const pages = await getRenderedPages();
    const emptyPages = pages.filter(function (page) {
      return !page.html || page.html.trim().length === 0;
    });

    assert(pages.length > 0, "Nenhuma pagina EJS encontrada para renderizar.");
    assert(
      emptyPages.length === 0,
      "Alguma view renderizou HTML vazio.",
      emptyPages.map(function (page) {
        return rel(page.file);
      }),
    );

    return `${pages.length} paginas`;
  });

  check("Frontend", "HTML renderizado completo e sem ids duplicados", async function () {
    const pages = await getRenderedPages();
    const failures = [];

    for (const page of pages) {
      const html = page.html;
      const pageName = rel(page.file);

      if (!/<!doctype\s+html>/i.test(html)) {
        failures.push(`${pageName}: falta <!DOCTYPE html>`);
      }

      for (const tag of ["html", "head", "body", "main"]) {
        if (!new RegExp(`<${tag}(\\s|>)`, "i").test(html)) {
          failures.push(`${pageName}: falta tag <${tag}>`);
        }
      }

      if (/<%[-_=]?/.test(html)) {
        failures.push(`${pageName}: sobrou marcador EJS no HTML renderizado`);
      }

      const ids = Array.from(html.matchAll(/\bid=["']([^"']+)["']/gi)).map(
        function (match) {
          return match[1];
        },
      );
      const duplicateIds = findDuplicates(ids);

      for (const duplicateId of duplicateIds) {
        failures.push(`${pageName}: id duplicado "${duplicateId}"`);
      }
    }

    assert(
      failures.length === 0,
      "Algumas paginas renderizadas nao estao completas ou tem ids duplicados.",
      failures,
    );

    return `${pages.length} paginas`;
  });

  check("Frontend", "CSS estruturalmente valido", function () {
    const cssFiles = listFiles(path.join(PUBLIC_DIR, "assets", "css"), function (file) {
      return path.extname(file).toLowerCase() === ".css";
    }).sort();
    const failures = [];

    for (const file of cssFiles) {
      const problem = findCssStructureProblem(readText(file));

      if (problem) failures.push(`${rel(file)}: ${problem}`);
    }

    assert(
      failures.length === 0,
      "CSS com chaves, parenteses ou comentarios inconsistentes.",
      failures,
    );

    return `${cssFiles.length} arquivos CSS`;
  });

  check("Frontend", "scripts de pagina existem e seletores principais batem", async function () {
    const pages = await getRenderedPages();
    const failures = [];
    let selectorCount = 0;

    for (const page of pages) {
      const scripts = extractHtmlRefs(page.file, page.html)
        .filter(function (ref) {
          return stripQueryAndHash(ref.value).endsWith(".js");
        })
        .map(resolveLocalPublicAsset)
        .filter(Boolean)
        .filter(function (file) {
          return rel(file) !== "public/js/main.js";
        })
        .filter(function (file) {
          return fs.existsSync(file);
        });

      const idsInPage = new Set(
        Array.from(page.html.matchAll(/\bid=["']([^"']+)["']/gi)).map(function (match) {
          return match[1];
        }),
      );

      for (const scriptFile of scripts) {
        const text = readText(scriptFile);
        const ids = extractDomIdsFromJs(text);
        selectorCount += ids.length;

        for (const id of ids) {
          if (!idsInPage.has(id)) {
            addWarning(
              "Frontend",
              `${rel(scriptFile)} usa #${id}, mas ${rel(page.file)} nao renderiza esse id inicialmente.`,
            );
          }
        }
      }
    }

    assert(
      failures.length === 0,
      "Algum script declarado em pagina nao foi encontrado.",
      failures,
    );

    return `${selectorCount} seletores id verificados`;
  });

  check("Frontend", "fetch do frontend bate com rotas Express", function () {
    const apiRoutes = getApiRoutes();
    const jsFiles = listFiles(path.join(PUBLIC_DIR, "js"), isJsFile).sort();
    const failures = [];
    let checked = 0;

    for (const file of jsFiles) {
      const calls = extractFetchCalls(file, readText(file));

      for (const call of calls) {
        if (!call.path.startsWith("/api/")) continue;

        checked += 1;

        const matchedRoute = findMatchingApiRoute(apiRoutes, call.method, call.path);

        if (!matchedRoute) {
          failures.push(`${rel(file)} chama ${call.method} ${call.path}, mas a rota Express nao existe`);
          continue;
        }

        if (matchedRoute.requiresAuth && !call.hasAuthorization) {
          failures.push(`${rel(file)} chama rota protegida ${call.method} ${call.path} sem Authorization`);
        }
      }
    }

    assert(
      failures.length === 0,
      "Algum fetch do frontend nao bate com a API Express.",
      failures,
    );

    return `${checked} chamadas fetch /api`;
  });

  check("Assets", "referencias locais em EJS, CSS e JS existem", async function () {
    const refs = await getLocalAssetReferences();
    const missing = [];

    for (const ref of refs) {
      const resolved = resolveLocalPublicAsset(ref);

      if (!resolved) continue;

      if (!fs.existsSync(resolved)) {
        missing.push(`${rel(ref.file)} -> ${ref.value} (${rel(resolved)})`);
      }
    }

    assert(
      missing.length === 0,
      "Alguns assets locais referenciados nao existem.",
      compactDetails(missing),
    );

    return `${refs.length} referencias`;
  });

  check("Assets", "binarios e imagens legiveis", function () {
    const assetFiles = getProjectFiles().filter(function (file) {
      return ASSET_EXTENSIONS.has(path.extname(file).toLowerCase());
    });
    const failures = [];

    for (const file of assetFiles) {
      const problem = validateAssetSignature(file, fs.readFileSync(file));

      if (problem) failures.push(`${rel(file)}: ${problem}`);
    }

    assert(
      failures.length === 0,
      "Assets binarios vazios ou com assinatura inesperada.",
      compactDetails(failures),
    );

    return `${assetFiles.length} assets`;
  });

  check("Dados", "SQL de init completo e na ordem certa", function () {
    const runSqlFile = path.join(SRC_DIR, "infra", "run-sql.js");
    const runSql = readText(runSqlFile);
    const arrayMatch = runSql.match(/const\s+sqlFiles\s*=\s*\[([\s\S]*?)\]/);

    assert(arrayMatch, "Nao consegui encontrar o array sqlFiles em src/infra/run-sql.js.");

    const declared = Array.from(arrayMatch[1].matchAll(/["']([^"']+\.sql)["']/g))
      .map(function (match) {
        return match[1];
      });
    const actual = listFiles(SQL_DIR, function (file) {
      return path.extname(file).toLowerCase() === ".sql";
    })
      .map(function (file) {
        return path.basename(file);
      })
      .sort();
    const missing = declared.filter(function (fileName) {
      return !fs.existsSync(path.join(SQL_DIR, fileName));
    });
    const extra = actual.filter(function (fileName) {
      return !declared.includes(fileName);
    });
    const orderProblems = declared.filter(function (fileName, index) {
      const expectedPrefix = String(index + 1).padStart(2, "0");
      return !fileName.startsWith(`${expectedPrefix}_`);
    });

    assert(
      missing.length === 0 && extra.length === 0 && orderProblems.length === 0,
      "A lista de SQL do runner nao bate com src/infra/init.",
      [
        ...missing.map(function (fileName) {
          return `Declarado mas ausente: ${fileName}`;
        }),
        ...extra.map(function (fileName) {
          return `Existe mas nao roda no db:init: ${fileName}`;
        }),
        ...orderProblems.map(function (fileName) {
          return `Fora da ordem numerica esperada: ${fileName}`;
        }),
      ],
    );

    return `${declared.length} scripts SQL`;
  });

  check("Dados", "SQL referencia seeds existentes", function () {
    const sqlFiles = listFiles(SQL_DIR, function (file) {
      return path.extname(file).toLowerCase() === ".sql";
    });
    const failures = [];
    const copyPattern = /__SEED_DATA_DIR__\/([^'\s;]+)/g;

    for (const file of sqlFiles) {
      const sql = readText(file);
      let match;

      while ((match = copyPattern.exec(sql)) !== null) {
        const seedFile = path.join(SEED_DIR, match[1]);

        if (!fs.existsSync(seedFile)) {
          failures.push(`${rel(file)} referencia seed ausente: ${match[1]}`);
        }
      }
    }

    assert(
      failures.length === 0,
      "Scripts SQL apontam para seeds inexistentes.",
      failures,
    );

    return `${sqlFiles.length} SQLs analisados`;
  });

  check("Dados", "repositories referenciam tabelas existentes no schema", function () {
    const schemaTables = getSchemaTables();
    const repositoryFiles = listFiles(path.join(SRC_DIR, "repositories"), isJsFile).sort();
    const failures = [];
    let references = 0;

    for (const file of repositoryFiles) {
      const sqlBlocks = extractSqlTemplateStrings(readText(file));

      for (const sql of sqlBlocks) {
        const tableRefs = extractSqlTableReferences(sql);
        references += tableRefs.length;

        for (const tableName of tableRefs) {
          if (!schemaTables.has(tableName)) {
            failures.push(`${rel(file)} referencia tabela ausente no schema: ${tableName}`);
          }
        }
      }
    }

    assert(
      failures.length === 0,
      "Alguma query de repository referencia tabela que nao existe nos SQLs de init.",
      failures,
    );

    return `${references} referencias a tabelas`;
  });

  check("Dados", "CSV de modulos, questoes e imagens consistente", function () {
    const modulosCsv = parseSemicolonCsv(path.join(SEED_DIR, "modulos.csv"));
    const questoesCsv = parseSemicolonCsv(path.join(SEED_DIR, "questoes.csv"));
    const requiredModuloHeaders = ["id_modulo", "titulo"];
    const requiredQuestaoHeaders = [
      "id_questao",
      "id_modulo",
      "grupo",
      "numero",
      "dificuldade",
      "enunciado",
      "alternativa_correta",
      "alternativa_a",
      "alternativa_b",
      "alternativa_c",
      "alternativa_d",
      "imagem",
    ];

    assertHeaders(modulosCsv, requiredModuloHeaders);
    assertHeaders(questoesCsv, requiredQuestaoHeaders);

    const moduloIds = new Set();
    const questaoIds = new Set();
    const problems = [];

    for (const row of modulosCsv.rows) {
      if (!isPositiveInteger(row.id_modulo)) {
        problems.push(`Modulo com id invalido: ${row.id_modulo}`);
      }

      if (moduloIds.has(row.id_modulo)) {
        problems.push(`Modulo duplicado: ${row.id_modulo}`);
      }

      moduloIds.add(row.id_modulo);
    }

    for (const row of questoesCsv.rows) {
      if (!isPositiveInteger(row.id_questao)) {
        problems.push(`Questao com id invalido: ${row.id_questao}`);
      }

      if (questaoIds.has(row.id_questao)) {
        problems.push(`Questao duplicada: ${row.id_questao}`);
      }

      questaoIds.add(row.id_questao);

      if (!moduloIds.has(row.id_modulo)) {
        problems.push(`Questao ${row.id_questao} aponta para modulo inexistente ${row.id_modulo}`);
      }

      if (!isPositiveInteger(row.numero)) {
        problems.push(`Questao ${row.id_questao} tem numero invalido`);
      }

      if (!["a", "b", "c", "d"].includes(String(row.alternativa_correta).toLowerCase())) {
        problems.push(`Questao ${row.id_questao} tem alternativa_correta invalida`);
      }

      for (const field of ["enunciado", "alternativa_a", "alternativa_b", "alternativa_c", "alternativa_d"]) {
        if (!String(row[field] || "").trim()) {
          problems.push(`Questao ${row.id_questao} esta sem ${field}`);
        }
      }

      const imageName = normalizeNullable(row.imagem);

      if (imageName && !fs.existsSync(path.join(SEED_DIR, "imagens", imageName))) {
        problems.push(`Questao ${row.id_questao} aponta para imagem ausente: ${imageName}`);
      }
    }

    assert(
      problems.length === 0,
      "Seeds CSV possuem inconsistencias.",
      compactDetails(problems),
    );

    return `${modulosCsv.rows.length} modulos, ${questoesCsv.rows.length} questoes`;
  });

  check("Docs", "README e docs com links locais validos", function () {
    const mdFiles = [
      path.join(ROOT, "README.md"),
      ...listFiles(DOCS_DIR, function (file) {
        return path.extname(file).toLowerCase() === ".md";
      }),
    ].filter(function (file) {
      return fs.existsSync(file);
    });
    const failures = [];

    for (const file of mdFiles) {
      const refs = extractMarkdownRefs(file, readText(file));

      for (const ref of refs) {
        if (!ref.value) {
          addWarning("Docs", `${rel(file)} contem link vazio.`);
          continue;
        }

        if (shouldSkipReference(ref.value) || ref.value.startsWith("#")) continue;

        const cleanValue = decodeUriPath(stripQueryAndHash(ref.value));
        const resolved = path.resolve(path.dirname(file), cleanValue);

        if (!fs.existsSync(resolved)) {
          failures.push(`${rel(file)} -> ${ref.value}`);
        }
      }
    }

    assert(
      failures.length === 0,
      "README/docs apontam para arquivos locais ausentes.",
      failures,
    );

    return `${mdFiles.length} markdown`;
  });

  check("Runtime", "servidor Express, paginas, APIs e assets via HTTP", async function () {
    const server = await startServer();

    try {
      const pageRoutes = getServerPageRoutes();
      const failures = [];

      for (const route of pageRoutes) {
        const response = await httpRequest(server.port, "GET", route.path);

        if (response.status < 200 || response.status >= 400) {
          failures.push(`GET ${route.path}: esperado 2xx/3xx, veio ${response.status}`);
        }
      }

      const apiChecks = [
        { method: "POST", path: "/api/usuarios/cadastro", body: {}, expected: 400 },
        { method: "POST", path: "/api/auth/login", body: {}, expected: 400 },
        { method: "GET", path: "/api/progresso/mapa", expected: 401 },
        { method: "GET", path: "/api/questoes/proxima-questao", expected: 401 },
        { method: "GET", path: "/api/rota-inexistente", expected: 404 },
        { method: "GET", path: "/pagina-inexistente", expected: 404 },
      ];

      for (const item of apiChecks) {
        const response = await httpRequest(server.port, item.method, item.path, item.body);

        if (response.status !== item.expected) {
          failures.push(`${item.method} ${item.path}: esperado ${item.expected}, veio ${response.status}`);
        }
      }

      const protectedRoutes = getApiRoutes().filter(function (route) {
        return route.requiresAuth;
      });

      for (const route of protectedRoutes) {
        const response = await httpRequest(server.port, route.method, sampleRoutePath(route.path), sampleRequestBody(route));

        if (response.status !== 401) {
          failures.push(`${route.method} ${route.path} sem token: esperado 401, veio ${response.status}`);
        }
      }

      const staticPaths = await getHttpStaticAssetSample();

      for (const staticPath of staticPaths) {
        const response = await httpRequest(server.port, "GET", staticPath);

        if (response.status !== 200) {
          failures.push(`GET ${staticPath}: esperado 200, veio ${response.status}`);
        }
      }

      assert(
        failures.length === 0,
        "Smoke test HTTP encontrou respostas inesperadas.",
        failures,
      );

      return `${pageRoutes.length} paginas, ${apiChecks.length + protectedRoutes.length} APIs, ${staticPaths.length} assets`;
    } finally {
      await stopServer(server);
    }
  });

  check("Runtime", "teste opcional de banco quando habilitado", async function () {
    if (process.env.RUN_DB_TESTS !== "1") {
      addWarning(
        "Runtime",
        "Banco nao testado nesta rodada. No PowerShell use `$env:RUN_DB_TESTS=\"1\"; npm run test`; no Bash use `RUN_DB_TESTS=1 npm run test`.",
      );
      return "pulado sem RUN_DB_TESTS=1";
    }

    const pool = require(path.join(SRC_DIR, "database", "db.js"));

    try {
      const result = await pool.query("SELECT 1 AS ok");

      assert(
        Number(result.rows[0] && result.rows[0].ok) === 1,
        "PostgreSQL respondeu, mas o SELECT 1 nao voltou como esperado.",
      );

      return "PostgreSQL respondeu SELECT 1";
    } finally {
      await pool.end();
    }
  });

  check("Feedback", "avisos vivos para o dev", function () {
    const warningsBefore = state.warnings.length;

    warnPotentialSecretLogs();

    const added = state.warnings.length - warningsBefore;
    return `${added} novo(s) aviso(s)`;
  });
}

function check(group, name, fn) {
  checks.push({ group, name, fn });
}

async function run() {
  const startedAt = Date.now();
  const groups = unique(
    checks.map(function (item) {
      return item.group;
    }),
  );

  printHeader(groups.length, checks.length);

  for (const group of groups) {
    console.log("");
    console.log(color("cyan", color("bold", group)));

    const groupChecks = checks.filter(function (item) {
      return item.group === group;
    });

    for (const item of groupChecks) {
      await runCheck(item);
    }
  }

  printSummary(Date.now() - startedAt);

  if (state.failed > 0) {
    process.exitCode = 1;
  }
}

async function runCheck(item) {
  const startedAt = Date.now();

  try {
    const detail = await item.fn();
    const elapsed = Date.now() - startedAt;
    state.passed += 1;
    state.results.push({ ...item, status: "pass", elapsed, detail });
    console.log(
      `  ${color("green", marks.pass)} ${item.name} ${color("gray", formatElapsed(elapsed))}${detail ? color("dim", `  ${detail}`) : ""}`,
    );
  } catch (error) {
    const elapsed = Date.now() - startedAt;
    state.failed += 1;
    state.results.push({ ...item, status: "fail", elapsed, error });
    console.log(`  ${color("red", marks.fail)} ${item.name} ${color("gray", formatElapsed(elapsed))}`);
    console.log(`    ${color("red", error.message)}`);

    if (error.details && error.details.length > 0) {
      for (const detail of compactDetails(error.details, 10)) {
        console.log(`    ${color("red", "x")} ${detail}`);
      }
    }
  }
}

function printHeader(groupCount, checkCount) {
  console.log("");
  console.log(color("bold", "== Project Test V3 =="));
  console.log(
    [
      `${marks.info} varredura completa sem dependencias novas`,
      `${groupCount} secoes`,
      `${checkCount} checks`,
      "npm run test",
    ].join(" | "),
  );
  console.log(color("gray", `Projeto: ${ROOT}`));
}

function printSummary(elapsedMs) {
  const warningCount = uniqueWarnings().length;

  console.log("");
  console.log(color("bold", "Resumo"));
  console.log(`${color("green", marks.pass)} Passou: ${state.passed}`);
  console.log(`${state.failed > 0 ? color("red", marks.fail) : color("green", marks.pass)} Falhou: ${state.failed}`);
  console.log(`${warningCount > 0 ? color("yellow", marks.warn) : color("green", marks.pass)} Avisos: ${warningCount}`);
  console.log(`${marks.info} Tempo: ${formatElapsed(elapsedMs)}`);

  if (state.failed > 0) {
    console.log("");
    console.log(color("red", color("bold", "Falhas para corrigir")));

    for (const result of state.results.filter(function (item) {
      return item.status === "fail";
    })) {
      console.log(`- [${result.group}] ${result.name}: ${result.error.message}`);
    }
  }

  const warnings = uniqueWarnings();

  if (warnings.length > 0) {
    console.log("");
    console.log(color("yellow", color("bold", "Avisos vivos")));

    for (const warning of warnings) {
      console.log(`- [${warning.group}] ${warning.message}`);
    }
  }

  console.log("");

  if (state.failed > 0) {
    console.log(color("red", "Resultado final: X vermelho. Corrija as falhas acima antes de seguir."));
    return;
  }

  console.log(color("green", "Resultado final: ✓ verde. A base passou pela varredura V3."));
}

function primeTestEnv() {
  const defaults = {
    NODE_ENV: "test",
    PORT: "3000",
    POSTGRES_HOST: "localhost",
    POSTGRES_USER: "test_user",
    POSTGRES_PASSWORD: "test_password",
    POSTGRES_DB: "test_db",
    POSTGRES_PORT: "5432",
    JWT_SECRET: "test-secret-local",
    DEFAULT_EXPIRES_IN_SECONDS: "3600",
  };

  for (const [key, value] of Object.entries(defaults)) {
    if (!process.env[key]) process.env[key] = value;
  }
}

function warnMissingRuntimeEnv() {
  const envFile = path.join(ROOT, ".env");

  if (!fs.existsSync(envFile)) {
    addWarning("Setup", ".env nao existe; o runner usa defaults so para teste.");
    return;
  }

  const envText = readText(envFile);
  const missing = REQUIRED_RUNTIME_ENV.filter(function (key) {
    return !new RegExp(`^\\s*${escapeRegExp(key)}\\s*=`, "m").test(envText);
  });

  if (missing.length > 0) {
    addWarning(
      "Setup",
      `.env esta sem ${missing.join(", ")}; o app real pode falhar fora do teste.`,
    );
  }
}

function warnPotentialSecretLogs() {
  const jsFiles = getProjectFiles().filter(function (file) {
    return path.extname(file).toLowerCase() === ".js";
  });
  const secretPatterns = [
    /console\.(log|info|warn|error)\([^)]*JWT_SECRET/gi,
    /console\.(log|info|warn|error)\([^)]*POSTGRES_PASSWORD/gi,
    /console\.(log|info|warn|error)\([^)]*password/gi,
  ];

  for (const file of jsFiles) {
    const text = readText(file);

    if (
      secretPatterns.some(function (pattern) {
        pattern.lastIndex = 0;
        return pattern.test(text);
      })
    ) {
      addWarning("Feedback", `${rel(file)} parece logar segredo/senha em console.`);
    }
  }
}

function getProjectFiles() {
  if (projectFilesCache.value) return projectFilesCache.value;

  const ignoredDirectories = new Set([".git", "node_modules"]);
  const files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (ignoredDirectories.has(entry.name)) continue;
        walk(absolutePath);
        continue;
      }

      if (entry.isFile()) files.push(absolutePath);
    }
  }

  walk(ROOT);
  projectFilesCache.value = files.sort();
  return projectFilesCache.value;
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      files.push(...listFiles(absolutePath, predicate));
      continue;
    }

    if (entry.isFile() && predicate(absolutePath)) files.push(absolutePath);
  }

  return files;
}

function isJsFile(file) {
  return path.extname(file).toLowerCase() === ".js";
}

function isTextLikeFile(file) {
  const basename = path.basename(file);
  const extension = path.extname(file).toLowerCase();
  return TEXT_EXTENSIONS.has(extension) || basename === ".env" || basename === ".gitignore";
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function assert(condition, message, details) {
  if (condition) return;

  const error = new Error(message);
  error.details = details || [];
  throw error;
}

function unique(items) {
  return Array.from(new Set(items));
}

function uniqueWarnings() {
  const seen = new Set();
  const warnings = [];

  for (const warning of state.warnings) {
    const key = `${warning.group}:${warning.message}`;

    if (seen.has(key)) continue;
    seen.add(key);
    warnings.push(warning);
  }

  return warnings;
}

function findDuplicates(items) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }

  return Array.from(duplicates);
}

function compactDetails(items, limit) {
  const max = limit || 20;

  if (items.length <= max) return items;

  return items.slice(0, max).concat(`... e mais ${items.length - max}`);
}

function addWarning(group, message) {
  state.warnings.push({ group, message });
}

function color(name, text) {
  if (!useColor) return String(text);

  return `${colorCodes[name] || ""}${text}${colorCodes.reset}`;
}

function formatElapsed(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatProcessFailure(file, result) {
  const output = [result.stderr, result.stdout]
    .filter(Boolean)
    .join("\n")
    .trim();

  return `${rel(file)}\n${output}`;
}

function createMockResponse() {
  return {
    body: null,
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function withMutedConsole(fn) {
  const original = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  console.log = function () {};
  console.info = function () {};
  console.warn = function () {};
  console.error = function () {};

  try {
    return fn();
  } finally {
    console.log = original.log;
    console.info = original.info;
    console.warn = original.warn;
    console.error = original.error;
  }
}

async function closeDbPoolIfLoaded() {
  const dbFile = path.join(SRC_DIR, "database", "db.js");

  if (!fs.existsSync(dbFile)) return;

  const cacheEntry = require.cache[require.resolve(dbFile)];

  if (!cacheEntry || !cacheEntry.exports || typeof cacheEntry.exports.end !== "function") {
    return;
  }

  try {
    await cacheEntry.exports.end();
  } catch (_error) {
    // Pool ja fechado ou sem conexao aberta.
  }
}

function extractDestructuredRequires(file, text) {
  const imports = [];
  const importPattern = /const\s*{\s*([\s\S]*?)\s*}\s*=\s*require\(\s*["']([^"']+)["']\s*\)/g;
  let match;

  while ((match = importPattern.exec(text)) !== null) {
    const names = match[1]
      .split(",")
      .map(function (item) {
        return item
          .replace(/\/\/.*$/g, "")
          .trim()
          .split(":")[0]
          .trim();
      })
      .filter(Boolean);

    if (names.length > 0) {
      imports.push({ file, names, target: match[2] });
    }
  }

  return imports;
}

function resolveRequireTarget(fromFile, target) {
  try {
    if (target.startsWith(".")) {
      return require.resolve(path.resolve(path.dirname(fromFile), target));
    }

    return require.resolve(target, { paths: [path.dirname(fromFile), ROOT] });
  } catch (_error) {
    return null;
  }
}

async function getRenderedPages() {
  if (renderedPagesCache.value) return renderedPagesCache.value;

  const ejs = require("ejs");
  const pageFiles = listFiles(PAGES_DIR, function (file) {
    return path.extname(file).toLowerCase() === ".ejs" && !rel(file).includes("/partials/");
  }).sort();
  const pages = [];
  const failures = [];

  for (const file of pageFiles) {
    try {
      const html = await ejs.renderFile(
        file,
        {},
        {
          filename: file,
          root: PAGES_DIR,
          views: [PAGES_DIR],
        },
      );
      pages.push({ file, html });
    } catch (error) {
      failures.push(`${rel(file)}: ${error.message}`);
    }
  }

  assert(failures.length === 0, "Alguma view EJS quebrou ao renderizar.", failures);

  renderedPagesCache.value = pages;
  return pages;
}

function getApiRoutes() {
  const indexFile = path.join(SRC_DIR, "routes", "index.js");
  const indexText = readText(indexFile);
  const requires = new Map();
  const importPattern = /const\s+(\w+)\s*=\s*require\(\s*["']\.\/([^"']+)["']\s*\)/g;
  const mountPattern = /router\.use\(\s*["']([^"']+)["']\s*,\s*(\w+)\s*\)/g;
  const routes = [];
  let match;

  while ((match = importPattern.exec(indexText)) !== null) {
    requires.set(match[1], match[2]);
  }

  while ((match = mountPattern.exec(indexText)) !== null) {
    const mountPath = match[1];
    const variableName = match[2];
    const requiredPath = requires.get(variableName);

    if (!requiredPath) continue;

    const routeFile = path.join(SRC_DIR, "routes", `${requiredPath}.js`);

    if (!fs.existsSync(routeFile)) {
      routes.push({
        method: "MISSING",
        path: joinUrl("/api", mountPath),
        regex: /^$/,
      });
      continue;
    }

    const routeCalls = extractRouterRouteCalls(readText(routeFile));

    for (const routeCall of routeCalls) {
      const method = routeCall.method;
      const routePath = joinUrl("/api", mountPath, routeCall.path);

      routes.push({
        method,
        path: routePath,
        regex: expressPathToRegex(routePath),
        requiresAuth: routeCall.requiresAuth,
      });
    }
  }

  return routes;
}

function extractRouterRouteCalls(text) {
  const calls = [];
  const routePattern = /router\.(get|post|patch|put|delete)\s*\(/g;
  let match;

  while ((match = routePattern.exec(text)) !== null) {
    const openParenIndex = text.indexOf("(", match.index);
    const closeParenIndex = findMatchingParen(text, openParenIndex);

    if (closeParenIndex === -1) continue;

    const args = splitTopLevelArguments(text.slice(openParenIndex + 1, closeParenIndex));
    const routePath = parseStringArgument(args[0] || "");

    if (!routePath) continue;

    calls.push({
      method: match[1].toUpperCase(),
      path: routePath,
      requiresAuth: args.slice(1).some(function (arg) {
        return /\bauthMiddleware\b/.test(arg);
      }),
    });
  }

  return calls;
}

function getServerPageRoutes() {
  const serverFile = path.join(SRC_DIR, "server.js");
  const server = readText(serverFile);
  const routes = [];
  const routePattern = /app\.get\(\s*["']([^"']+)["'][\s\S]*?res\.render\(\s*["']([^"']+)["']/g;
  let match;

  while ((match = routePattern.exec(server)) !== null) {
    routes.push({ path: match[1], view: match[2] });
  }

  return routes;
}

function expressPathToRegex(routePath) {
  const escaped = escapeRegExp(routePath).replace(/:([A-Za-z0-9_]+)/g, "[^/]+");
  return new RegExp(`^${escaped}$`);
}

function sampleRoutePath(routePath) {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, "1");
}

function sampleRequestBody(route) {
  if (["POST", "PATCH", "PUT"].includes(route.method)) return {};
  return undefined;
}

function joinUrl() {
  const parts = Array.from(arguments).filter(Boolean);
  const joined = parts
    .map(function (part) {
      return String(part).replace(/^\/+|\/+$/g, "");
    })
    .filter(Boolean)
    .join("/");

  return `/${joined}`;
}

function extractHtmlRefs(file, html) {
  const refs = [];
  const attrPattern = /\b(?:src|href)=["']([^"']+)["']/gi;
  let match;

  while ((match = attrPattern.exec(html)) !== null) {
    refs.push({ file, value: match[1] });
  }

  return refs;
}

function extractCssRefs(file, css) {
  const refs = [];
  const urlPattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi;
  let match;

  while ((match = urlPattern.exec(css)) !== null) {
    refs.push({ file, value: match[2] });
  }

  return refs;
}

function extractJsRefs(file, js) {
  const refs = [];
  const stringPattern = /(["'`])([^"'`]*(?:\/assets\/|\/js\/|\.png|\.jpg|\.jpeg|\.gif|\.webp|\.svg|\.css|\.js)[^"'`]*)\1/g;
  let match;

  while ((match = stringPattern.exec(js)) !== null) {
    const value = match[2];

    if (value.includes("${")) continue;
    refs.push({ file, value });
  }

  return refs;
}

function extractFetchCalls(file, js) {
  const calls = [];
  const fetchPattern = /\bfetch\s*\(/g;
  let match;

  while ((match = fetchPattern.exec(js)) !== null) {
    const openParenIndex = js.indexOf("(", match.index);
    const closeParenIndex = findMatchingParen(js, openParenIndex);

    if (closeParenIndex === -1) {
      addWarning("Frontend", `${rel(file)} contem fetch sem fechamento de parenteses.`);
      continue;
    }

    const args = splitTopLevelArguments(js.slice(openParenIndex + 1, closeParenIndex));
    const rawPath = parseStringArgument(args[0] || "");

    if (!rawPath) {
      addWarning("Frontend", `${rel(file)} contem fetch com URL dinamica demais para validar estaticamente.`);
      continue;
    }

    const options = args[1] || "";
    const methodMatch = options.match(/\bmethod\s*:\s*["'`]([A-Za-z]+)["'`]/);

    calls.push({
      file,
      hasAuthorization: /\bAuthorization\s*:/.test(options),
      method: methodMatch ? methodMatch[1].toUpperCase() : "GET",
      path: rawPath.replace(/\$\{[^}]+}/g, "1"),
    });
  }

  return calls;
}

function findMatchingApiRoute(apiRoutes, method, requestPath) {
  return apiRoutes.find(function (route) {
    return route.method === method && route.regex.test(requestPath);
  });
}

function extractMarkdownRefs(file, markdown) {
  const refs = [];
  const markdownLinkPattern = /!?\[[^\]]*]\(([^)]*)\)/g;
  const attrPattern = /\b(?:src|href)=["']([^"']*)["']/gi;
  let match;

  while ((match = markdownLinkPattern.exec(markdown)) !== null) {
    refs.push({ file, value: match[1].trim() });
  }

  while ((match = attrPattern.exec(markdown)) !== null) {
    refs.push({ file, value: match[1].trim() });
  }

  return refs;
}

function extractDomIdsFromJs(js) {
  const ids = [];
  const patterns = [
    /getElementById\(\s*["']([^"']+)["']\s*\)/g,
    /querySelector(?:All)?\(\s*["']#([A-Za-z0-9_-]+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.exec(js)) !== null) {
      ids.push(match[1]);
    }
  }

  return unique(ids);
}

function findMatchingParen(text, openParenIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = openParenIndex; index < text.length; index += 1) {
    const char = text[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "(") {
      depth += 1;
      continue;
    }

    if (char === ")") {
      depth -= 1;

      if (depth === 0) return index;
    }
  }

  return -1;
}

function splitTopLevelArguments(source) {
  const args = [];
  let current = "";
  let parenDepth = 0;
  let braceDepth = 0;
  let bracketDepth = 0;
  let quote = null;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      current += char;

      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      current += char;
      continue;
    }

    if (char === "(") parenDepth += 1;
    if (char === ")") parenDepth -= 1;
    if (char === "{") braceDepth += 1;
    if (char === "}") braceDepth -= 1;
    if (char === "[") bracketDepth += 1;
    if (char === "]") bracketDepth -= 1;

    if (char === "," && parenDepth === 0 && braceDepth === 0 && bracketDepth === 0) {
      args.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  if (current.trim()) args.push(current.trim());
  return args;
}

function parseStringArgument(argument) {
  const trimmed = String(argument || "").trim();
  const quote = trimmed[0];

  if (!quote || !["\"", "'", "`"].includes(quote) || trimmed[trimmed.length - 1] !== quote) {
    return null;
  }

  return trimmed.slice(1, -1);
}

async function getLocalAssetReferences() {
  const pages = await getRenderedPages();
  const cssFiles = listFiles(path.join(PUBLIC_DIR, "assets", "css"), function (file) {
    return path.extname(file).toLowerCase() === ".css";
  }).sort();
  const jsFiles = listFiles(path.join(PUBLIC_DIR, "js"), isJsFile).sort();
  const refs = [];

  for (const page of pages) {
    refs.push(...extractHtmlRefs(page.file, page.html));
  }

  for (const file of cssFiles) {
    refs.push(...extractCssRefs(file, readText(file)));
  }

  for (const file of jsFiles) {
    refs.push(...extractJsRefs(file, readText(file)));
  }

  return refs;
}

function resolveLocalPublicAsset(ref) {
  const cleanValue = stripQueryAndHash(String(ref.value).trim());

  if (!cleanValue || shouldSkipReference(cleanValue)) return null;

  if (cleanValue.startsWith("/")) {
    if (!isStaticAssetPath(cleanValue)) return null;
    return path.join(PUBLIC_DIR, cleanValue.replace(/^\//, ""));
  }

  if (!looksLikeAsset(cleanValue)) return null;

  return path.resolve(path.dirname(ref.file), cleanValue);
}

function stripQueryAndHash(value) {
  return value.split("#")[0].split("?")[0];
}

function decodeUriPath(value) {
  try {
    return decodeURIComponent(value);
  } catch (_error) {
    return value;
  }
}

function shouldSkipReference(value) {
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("data:") ||
    value === "#"
  );
}

function isStaticAssetPath(value) {
  return (
    value.startsWith("/assets/") ||
    value.startsWith("/js/") ||
    value.startsWith("/css/") ||
    looksLikeAsset(value)
  );
}

function looksLikeAsset(value) {
  return /\.(css|js|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|mp3|mp4)$/i.test(value);
}

function findCssStructureProblem(css) {
  const stack = [];
  let quote = null;
  let inComment = false;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    const next = css[index + 1];

    if (inComment) {
      if (char === "*" && next === "/") {
        inComment = false;
        index += 1;
      }

      continue;
    }

    if (quote) {
      if (char === "\\") {
        index += 1;
        continue;
      }

      if (char === quote) quote = null;
      continue;
    }

    if (char === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }

    if (char === "{" || char === "(") {
      stack.push({ char, index });
      continue;
    }

    if (char === "}" || char === ")") {
      const expected = char === "}" ? "{" : "(";
      const current = stack.pop();

      if (!current || current.char !== expected) {
        return `fechamento "${char}" sem abertura correspondente perto do caractere ${index}`;
      }
    }
  }

  if (inComment) return "comentario CSS aberto e nao fechado";
  if (quote) return `string CSS aberta com ${quote} e nao fechada`;

  if (stack.length > 0) {
    const current = stack[stack.length - 1];
    return `abertura "${current.char}" sem fechamento perto do caractere ${current.index}`;
  }

  return null;
}

function validateAssetSignature(file, buffer) {
  if (!buffer || buffer.length === 0) return "arquivo vazio";

  const extension = path.extname(file).toLowerCase();

  if (extension === ".png") {
    return buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"
      ? null
      : "assinatura PNG invalida";
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
      ? null
      : "assinatura JPEG invalida";
  }

  if (extension === ".gif") {
    const signature = buffer.subarray(0, 6).toString("ascii");
    return signature === "GIF87a" || signature === "GIF89a"
      ? null
      : "assinatura GIF invalida";
  }

  if (extension === ".webp") {
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    return riff === "RIFF" && webp === "WEBP" ? null : "assinatura WebP invalida";
  }

  if (extension === ".svg") {
    return /<svg[\s>]/i.test(buffer.toString("utf8"))
      ? null
      : "SVG nao contem tag <svg>";
  }

  return null;
}

function parseSemicolonCsv(file) {
  const lines = readText(file)
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(function (line) {
      return line.trim().length > 0;
    });

  assert(lines.length > 0, `${rel(file)} esta vazio.`);

  const headers = lines[0].split(";");
  const rows = [];
  const problems = [];

  for (let index = 1; index < lines.length; index += 1) {
    const values = lines[index].split(";");

    if (values.length !== headers.length) {
      problems.push(`${rel(file)} linha ${index + 1}: esperado ${headers.length} colunas, veio ${values.length}`);
      continue;
    }

    const row = {};

    headers.forEach(function (header, headerIndex) {
      row[header] = values[headerIndex];
    });

    rows.push(row);
  }

  assert(problems.length === 0, "CSV com numero de colunas inconsistente.", problems);

  return { file, headers, rows };
}

function assertHeaders(csv, requiredHeaders) {
  const missing = requiredHeaders.filter(function (header) {
    return !csv.headers.includes(header);
  });

  assert(
    missing.length === 0,
    `${rel(csv.file)} esta sem colunas obrigatorias.`,
    missing,
  );
}

function isPositiveInteger(value) {
  return /^[1-9]\d*$/.test(String(value));
}

function normalizeNullable(value) {
  const clean = String(value || "").trim();

  if (!clean || clean.toUpperCase() === "NULL") return null;

  return clean;
}

function extractSqlTemplateStrings(js) {
  const sqlBlocks = [];
  const queryPattern = /(?:pool|client)\.query\(\s*`([\s\S]*?)`/g;
  let match;

  while ((match = queryPattern.exec(js)) !== null) {
    sqlBlocks.push(match[1]);
  }

  return sqlBlocks;
}

function findSqlPlaceholderProblem(sql) {
  const placeholders = unique(
    Array.from(sql.matchAll(/\$(\d+)/g)).map(function (match) {
      return Number(match[1]);
    }),
  ).sort(function (a, b) {
    return a - b;
  });

  if (placeholders.length === 0) return null;

  for (let index = 0; index < placeholders.length; index += 1) {
    const expected = index + 1;

    if (placeholders[index] !== expected) {
      return `placeholders esperados em sequencia a partir de $1, encontrados ${placeholders
        .map(function (number) {
          return `$${number}`;
        })
        .join(", ")}`;
    }
  }

  return null;
}

function getSchemaTables() {
  const tables = new Set();
  const sqlFiles = listFiles(SQL_DIR, function (file) {
    return path.extname(file).toLowerCase() === ".sql";
  });

  for (const file of sqlFiles) {
    const sql = readText(file);
    const createPattern = /\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:(?:public)\.)?([A-Za-z_][A-Za-z0-9_]*)/gi;
    let match;

    while ((match = createPattern.exec(sql)) !== null) {
      tables.add(match[1].toLowerCase());
    }
  }

  return tables;
}

function extractSqlTableReferences(sql) {
  const tables = [];
  const cteNames = extractSqlCteNames(sql);
  const tablePattern = /\b(?:FROM|JOIN|UPDATE|INTO)\s+(?:(?:public)\.)?([A-Za-z_][A-Za-z0-9_]*)/gi;
  let match;

  while ((match = tablePattern.exec(sql)) !== null) {
    const tableName = match[1].toLowerCase();
    const nextChar = sql[match.index + match[0].length];

    if (
      nextChar !== "." &&
      !cteNames.has(tableName) &&
      !["select", "set", "values"].includes(tableName)
    ) {
      tables.push(tableName);
    }
  }

  return unique(tables);
}

function extractSqlCteNames(sql) {
  const cteNames = new Set();
  const ctePattern = /(?:\bWITH|,)\s+([A-Za-z_][A-Za-z0-9_]*)\s+AS\s*\(/gi;
  let match;

  while ((match = ctePattern.exec(sql)) !== null) {
    cteNames.add(match[1].toLowerCase());
  }

  return cteNames;
}

async function startServer() {
  const port = await getFreePort();
  const child = spawn(process.execPath, [path.join(SRC_DIR, "server.js")], {
    cwd: ROOT,
    env: {
      ...process.env,
      NODE_ENV: "test",
      PORT: String(port),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const logs = [];

  child.stdout.on("data", function (chunk) {
    logs.push(chunk.toString());
  });

  child.stderr.on("data", function (chunk) {
    logs.push(chunk.toString());
  });

  const startedAt = Date.now();

  while (Date.now() - startedAt < 7000) {
    if (child.exitCode !== null) {
      throw new Error(`Servidor encerrou antes de responder.\n${logs.join("").trim()}`);
    }

    try {
      const response = await httpRequest(port, "GET", "/");

      if (response.status >= 200 && response.status < 500) {
        return { child, port, logs };
      }
    } catch (_error) {
      // Servidor ainda subindo.
    }

    await delay(150);
  }

  await stopServer({ child });
  throw new Error(`Servidor nao respondeu em 7s.\n${logs.join("").trim()}`);
}

async function stopServer(server) {
  if (!server || !server.child || server.child.exitCode !== null) return;

  await new Promise(function (resolve) {
    const timeout = setTimeout(function () {
      if (server.child.exitCode === null) server.child.kill("SIGKILL");
      resolve();
    }, 2000);

    server.child.once("exit", function () {
      clearTimeout(timeout);
      resolve();
    });

    server.child.kill("SIGTERM");
  });
}

function httpRequest(port, method, requestPath, body) {
  const payload = body === undefined ? null : JSON.stringify(body);

  return new Promise(function (resolve, reject) {
    const request = http.request(
      {
        host: "127.0.0.1",
        port,
        method,
        path: requestPath,
        headers: payload
          ? {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(payload),
            }
          : {},
        timeout: 3000,
      },
      function (response) {
        const chunks = [];

        response.on("data", function (chunk) {
          chunks.push(chunk);
        });

        response.on("end", function () {
          resolve({
            body: Buffer.concat(chunks).toString("utf8"),
            headers: response.headers,
            status: response.statusCode,
          });
        });
      },
    );

    request.on("timeout", function () {
      request.destroy(new Error(`${method} ${requestPath} excedeu o tempo limite`));
    });
    request.on("error", reject);

    if (payload) request.write(payload);
    request.end();
  });
}

function getFreePort() {
  return new Promise(function (resolve, reject) {
    const server = net.createServer();

    server.once("error", reject);
    server.listen(0, "127.0.0.1", function () {
      const address = server.address();
      const port = address.port;

      server.close(function () {
        resolve(port);
      });
    });
  });
}

async function getHttpStaticAssetSample() {
  const refs = await getLocalAssetReferences();
  const paths = [];

  for (const ref of refs) {
    const cleanValue = stripQueryAndHash(String(ref.value || "").trim());

    if (!cleanValue.startsWith("/")) continue;
    if (!isStaticAssetPath(cleanValue)) continue;

    paths.push(cleanValue);
  }

  const firstSeedImage = findFirstSeedImage();

  if (firstSeedImage) {
    paths.push(`/assets/img/questoes/${encodeURIComponent(firstSeedImage)}`);
  }

  return unique(paths).slice(0, 30);
}

function findFirstSeedImage() {
  const csvFile = path.join(SEED_DIR, "questoes.csv");

  if (!fs.existsSync(csvFile)) return null;

  const questoesCsv = parseSemicolonCsv(csvFile);

  for (const row of questoesCsv.rows) {
    const imageName = normalizeNullable(row.imagem);

    if (imageName) return imageName;
  }

  return null;
}

function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
