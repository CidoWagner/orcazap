// ====== CONFIGURAÇÃO DO SUPABASE ======
const SUPABASE_URL = "https://tisoftuikvtgkngwrszh.supabase.co";
const SUPABASE_KEY = "sb_publishable_bUCzdW_A7zsMW5Ubh3zEJw_1cZuJ5bG";

// Inicializa o cliente do Supabase globalmente com um nome diferente para evitar conflito
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ====== MAPEAMENTO DOS ELEMENTOS DA TELA (DOM) ======
const authSwitcher = document.getElementById('auth-switcher');
const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');
const authForm = document.getElementById('auth-form');
const btnSubmit = document.getElementById('btn-submit');
const forgetPasswordRow = document.getElementById('forget-password-row');

// Campos exclusivos de cadastro
const nomeNegocioInput = document.getElementById('nome_negocio');
const profissaoSelect = document.getElementById('profissao');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Estado inicial do fluxo ('login' ou 'cadastro')
let modoAtual = 'login';

// ====== EVENTOS: ALTERNÂNCIA DE ABAS ======
tabLogin.addEventListener('click', () => {
    modoAtual = 'login';
    authSwitcher.setAttribute('data-mode', 'login');
    tabLogin.classList.add('is-active');
    tabCadastro.classList.remove('is-active');
    btnSubmit.innerText = 'Entrar no Sistema';
    forgetPasswordRow.style.display = 'flex';
    
    // Remove obrigatoriedade dos campos de cadastro para não travar o envio
    nomeNegocioInput.removeAttribute('required');
    profissaoSelect.removeAttribute('required');
});

tabCadastro.addEventListener('click', () => {
    modoAtual = 'cadastro';
    authSwitcher.setAttribute('data-mode', 'cadastro');
    tabCadastro.classList.add('is-active');
    tabLogin.classList.remove('is-active');
    btnSubmit.innerText = 'Criar Minha Conta';
    forgetPasswordRow.style.display = 'none';
    
    // Torna obrigatório no momento do cadastro
    nomeNegocioInput.setAttribute('required', '');
    profissaoSelect.setAttribute('required', '');
});

// ====== EVENTOS: PROCESSAMENTO DO FORMULÁRIO ======
authForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (modoAtual === 'login') {
        // --- Fluxo de Autenticação (Login) ---
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        
        if (error) {
            alert('Erro ao entrar: ' + error.message);
        } else {
            alert('Login efetuado com sucesso! Redirecionando...');
            // Futuramente: window.location.href = 'calculadora.html';
        }
        
    } else {
        // --- Fluxo de Criação de Conta (Cadastro) ---
        const nomeNegocio = nomeNegocioInput.value;
        const profissao = profissaoSelect.value;
        
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nome_negocio: nomeNegocio,
                    profissao: profissao
                }
            }
        });
        
        if (error) {
            alert('Erro no cadastro: ' + error.message);
        } else {
            alert('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro.');
        }
    }
});

