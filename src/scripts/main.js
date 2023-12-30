document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-sorteador').addEventListener('submit', function(evento) {
        evento.preventDefault(); // prevenindo o comportamento padrão do formulário (que é input desaparecer após o submit ser clicado)
        let numeroMaximo = document.getElementById('numero-maximo').value;
        numeroMaximo = parseInt(numeroMaximo);

        let numeroAleatorio = Math.random() * numeroMaximo; 
        numeroAleatorio = Math.floor(numeroAleatorio + 1); //Math.floor para arredondar pra baixo

        document.getElementById('resultado-valor').innerText = numeroAleatorio; 
        document.querySelector('.resultado').style.display = 'block'; 
        
        //Math.round para arredondar o float de acordo com valor dos decimais
        //Math.ceil para arredondar pra cima
    })
})

// 'DOMContentLoaded' como primeiro argumento para que o código js só comece a ser executado 
// após todo o carregamento da página