// ====== CONFIGURAÇÃO DO SUPABASE (Dados Oficiais - Corrigido!) ======
const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_bUCzdW_A7zsMW5Ubh3zEJw_1cZuJ5bG";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ====== MAPEAMENTO DOS ELEMENTOS DA TELA ======
const authSwitcher = document.getElementById('auth-switcher');
const tabLogin = document.getElementById('tab-login');
const tabCadastro = document.getElementById('tab-cadastro');
const authForm = document.getElementById('auth-form');
const btnSubmit = document.getElementById('btn-submit');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const nomeNegocioInput = document.getElementById('nome_negocio');
const profissaoSelect = document.getElementById('profissao');

let modoAtual = 'login';

// ====== LOGICA DE ALTERNANCIA DAS ABAS ======
if (tabLogin && tabCadastro && authSwitcher) {
    tabLogin.addEventListener('click', () => {
        modoAtual = 'login';
        authSwitcher.setAttribute('data-mode', 'login');
        tabLogin.classList.add('is-active');
        tabCadastro.classList.remove('is-active');
        if (btnSubmit) btnSubmit.innerText = 'Entrar no Sistema';
        
        if (nomeNegocioInput) nomeNegocioInput.removeAttribute('required');
        if (profissaoSelect) profissaoSelect.removeAttribute('required');
    });

    tabCadastro.addEventListener('click', () => {
        modoAtual = 'cadastro';
        authSwitcher.setAttribute('data-mode', 'cadastro');
        tabCadastro.classList.add('is-active');
        tabLogin.classList.remove('is-active');
        if (btnSubmit) btnSubmit.innerText = 'Criar Minha Conta';
        
        if (nomeNegocioInput) nomeNegocioInput.setAttribute('required', '');
        if (profissaoSelect) profissaoSelect.setAttribute('required', '');
    });
}

// ====== LOGICA DO ENVIO DO FORMULARIO ======
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (btnSubmit) {
            btnSubmit.innerText = 'Processando...';
            btnSubmit.disabled = true;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (modoAtual === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                alert('Erro ao entrar: ' + error.message);
                if (btnSubmit) {
                    btnSubmit.innerText = 'Entrar no Sistema';
                    btnSubmit.disabled = false;
                }
            } else {
                alert('Login efetuado com sucesso! Abrindo calculadora...');
                window.location.href = 'calculadora.html';
            }
        } else {
            const nomeNegocio = nomeNegocioInput ? nomeNegocioInput.value.trim() : '';
            const profissao = profissaoSelect ? profissaoSelect.value : 'Outro';

            const { data, error } = await supabase.auth.signUp({
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
                if (btnSubmit) {
                    btnSubmit.innerText = 'Criar Minha Conta';
                    btnSubmit.disabled = false;
                }
            } else {
                alert('Conta criada com sucesso! Você já pode fazer o login clicando na aba "Entrar".');
                if (btnSubmit) {
                    btnSubmit.innerText = 'Criar Minha Conta';
                    btnSubmit.disabled = false;
                }
                if (tabLogin) tabLogin.click();
            }
        }
    });
}


