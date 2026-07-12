const SUPABASE_URL = "https://tisoftuikvtgkngwrszh.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_bUCzdW_A7zsMW5Ubh3zEJw_1cZuJ5bG";

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const cadastroForm = document.getElementById('cadastro-form');
const btnSubmit = document.getElementById('btn-submit');

if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de recarregar
        console.log("Tentando cadastrar usuário...");
        
        if (btnSubmit) {
            btnSubmit.innerText = 'Processando...';
            btnSubmit.disabled = true;
        }

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const nomeNegocio = document.getElementById('nome_negocio').value.trim();
        const profissao = document.getElementById('profissao').value;

        // Dispara os dados direto para o Supabase Authentication
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
            alert('Erro no Supabase: ' + error.message);
            if (btnSubmit) {
                btnSubmit.innerText = 'Criar Minha Conta Grátis';
                btnSubmit.disabled = false;
            }
        } else {
            alert('CONTA CRIADA COM SUCESSO! Abrindo a calculadora...');
            // Redireciona direto para a calculadora automática do marmorista
            window.location.href = 'calculadora.html';
        }
    });
}


