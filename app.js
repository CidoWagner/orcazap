const SUPABASE_URL = "https://supabase.co";
const SUPABASE_KEY = "sb_publishable_bUCzdW_A7zsMW5Ubh3zEJw_1cZuJ5bG";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

if (tabLogin && tabCadastro && authSwitcher && authForm) {
    tabLogin.addEventListener('click', () => {
        modoAtual = 'login';
        authSwitcher.setAttribute('data-mode', 'login');
        authForm.className = "mode-login"; // Altera a classe do form para esconder campos extras
        tabLogin.classList.add('is-active');
        tabCadastro.classList.remove('is-active');
        if (btnSubmit) btnSubmit.innerText = 'Entrar no Sistema';
    });

    tabCadastro.addEventListener('click', () => {
        modoAtual = 'cadastro';
        authSwitcher.setAttribute('data-mode', 'cadastro');
        authForm.className = "mode-cadastro"; // Altera a classe do form para exibir campos extras
        tabCadastro.classList.add('is-active');
        tabLogin.classList.remove('is-active');
        if (btnSubmit) btnSubmit.innerText = 'Criar Minha Conta';
    });
}

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Formulário enviado no modo: " + modoAtual);
        
        if (btnSubmit) {
            btnSubmit.innerText = 'Processando...';
            btnSubmit.disabled = true;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (modoAtual === 'login') {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
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
                alert('Conta criada com sucesso! Entre na aba "Entrar" para acessar o sistema.');
                if (btnSubmit) {
                    btnSubmit.innerText = 'Criar Minha Conta';
                    btnSubmit.disabled = false;
                }
                if (tabLogin) tabLogin.click();
            }
        }
    });
}


