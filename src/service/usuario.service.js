// importando os respectivos arquivos que está dentro de um json.
const {
 createUsuario,
 updateUsuarioCpf,
 findUsuarioById,
 updateUsuarioNome,
 updateUsuarioEmail,
 updateUsuarioSenha
} = require("../repositories/usuarios.repositories");

// define o cadastro do usuário
async function createUsuarioService(nome,email,cpf,senha){

 // verifica se as informações estão corretas.
 if (!cpf || !nome || !senha) {
   throw new Error("Nome, e-mail e senha são obrigatórios");
 }

 // verifica se a senha tem ao menos 6 caracteres.
 if (senha.trim().length < 6) {
   throw new Error("a senha deve ter pelo menos 6 caracteres");
 }

 return await createUsuario(nome,email,cpf,senha);

}

// PATCH CPF
async function updateUsuarioCpfService(idUsuario, cpf){

 if (!idUsuario){
   throw new Error("id_usuario inválido");
 }

 if(!cpf){
   throw new Error("CPF obrigatório");
 }

 const result = await updateUsuarioCpf(idUsuario, cpf);

 if(!result){
   throw new Error("usuário não encontrado");
 }

 return await findUsuarioById(result.id_usuario);

}

// PATCH NOME
async function updateUsuarioNomeService(idUsuario,nome){

 if(!nome){
   throw new Error("nome é obrigatório");
 }

 const result = await updateUsuarioNome(idUsuario,nome);

 if(!result){
   throw new Error("usuário não encontrado");
 }

 return await findUsuarioById(result.id_usuario);

}

// PATCH EMAIL
async function updateUsuarioEmailService(idUsuario,email){

 if(!email){
   throw new Error("email obrigatório");
 }

 const result = await updateUsuarioEmail(idUsuario,email);

 if(!result){
   throw new Error("usuário não encontrado");
 }

 return await findUsuarioById(result.id_usuario);

}

// PATCH SENHA
async function updateUsuarioSenhaService(idUsuario,senha){

 if(!senha){
   throw new Error("senha obrigatória");
 }

 if (senha.trim().length < 6) {
   throw new Error("a senha deve ter pelo menos 6 caracteres");
 }

 const result = await updateUsuarioSenha(idUsuario,senha);

 if(!result){
   throw new Error("usuário não encontrado");
 }

 return await findUsuarioById(result.id_usuario);

}

module.exports = {
 createUsuarioService,
 updateUsuarioCpfService,
 updateUsuarioNomeService,
 updateUsuarioEmailService,
 updateUsuarioSenhaService
};