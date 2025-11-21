const inputAno = window.document.getElementById('ano')
const inputMes = window.document.getElementById('mes')
const inputDia = window.document.getElementById('dia')
const inputTipo = window.document.getElementById('tipo')
const inputDescricao = window.document.getElementById('descricao')
const inputValor = window.document.getElementById('valor')

class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano,
            this.mes = mes,
            this.dia = dia
        this.tipo = tipo,
            this.descricao = descricao,
            this.valor = valor
    }

    validarDados() {
        // this representa o objeto despesa criado
        // i indica o index do elemento
        for (let i in this) {
            if (this[i] == undefined || this[i] == "" || this[i] == null) {
                return false
            }
            else {
                return true
            }
        }
    }

}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravarDespesa(d) {
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(arr) {


        let id = localStorage.getItem('id')

        // recupera todas as despesas pelo for
        for (let i = 1; i <= id; i++) {

            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            arr.push(despesa)
        }

    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()
        this.recuperarTodosRegistros(despesasFiltradas)
        console.log(despesasFiltradas)

        // ano
        if (despesa.ano !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }

        // mes
        if (despesa.mes !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        // dia 
        if (despesa.dia !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }


        // tipo
        if (despesa.tipo !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        // descricao
        if (despesa.descricao !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }

        //valor
        if (despesa.valor !== "") {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa() {

    function modularModal(par) {

        const header = document.getElementById('m-header')
        const title = document.getElementById('m-title')
        const body = document.getElementById('m-body')
        const btn = document.getElementById('m-btn')

        if (par == true) {
            header.className = 'modal-header text-success'
            title.innerText = "Operação realizada com sucesso!"
            body.innerText = "Os dados da despesa foram cadastrados com êxito."
            btn.className = 'btn btn-success'
            btn.innerText = "Voltar"
        }

        else {
            header.className = 'modal-header text-danger'
            title.innerText = "Erro na gravação!"
            body.innerText = "Todos os campos devem ser preenchidos com dados válidos."
            btn.className = 'btn btn-danger'
            btn.innerText = "Voltar e corrigir"
        }

    }


    let despesa = new Despesa(

        inputAno.value,
        inputMes.value,
        inputDia.value,
        inputTipo.value,
        inputDescricao.value,
        inputValor.value
    )

    if (despesa.validarDados()) {
        bd.gravarDespesa(despesa)
        // ativa o modal usando JQuery
        modularModal(true)
        $('#modalRegistroDespesas').modal('show')

        inputAno.value = ""
        inputMes.value = ""
        inputDia.value = ""
        inputTipo.value = ""
        inputDescricao.value = ""
        inputValor.value = ""
    }
    else {
        // ativa o modal usando JQuery
        console.error("Erro!")
        modularModal()
        $('#modalRegistroDespesas').modal('show')
    }

}

const divBtn = document.getElementById('div-btn')

// se o array for vazio e não for uma requisição de filtragem, retorna todos
function carregaListaDespesas(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        bd.recuperarTodosRegistros(despesas)
    }

    const table = document.getElementById('table')
    table.innerHTML = ""

    despesas.forEach((d) => {

        let row = table.insertRow()
        row.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano} `
        switch (parseInt(d.tipo)) {
            case 1:
                row.insertCell(1).innerHTML = "Alimentação"
                break;
            case 2:
                row.insertCell(1).innerHTML = "Educação"
                break;
            case 3:
                row.insertCell(1).innerHTML = "Lazer"
                break;
            case 4:
                row.insertCell(1).innerHTML = "Saúde"
                break;
            case 5:
                row.insertCell(1).innerHTML = "Transporte"
                break;
        }
        row.insertCell(2).innerHTML = d.descricao
        row.insertCell(3).innerHTML = `R$${d.valor}`

        // criando o botão de exclusão
        const btn = document.createElement('button')
        btn.className = "btn btn-danger"
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = d.id
        btn.onclick = (() => {
            //console.log(btn.id)
            bd.remover(btn.id)
            window.location.reload()
        })
        row.insertCell(4).append(btn)
        const btn2 = document.createElement('button')
        btn2.className = "btn btn-primary"
        btn2.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        btn2.id = d.id
        btn2.onclick = (() => {

            inputAno.value = d.ano
            inputMes.value = d.mes
            inputDia.value = d.dia
            inputTipo.value = d.tipo
            inputDescricao.value = d.descricao
            inputValor.value = d.valor

            // verifica se o botão já existe
            let btnEdit = document.getElementById('btn-editar-unico')

            // se não existe, cria um
            if (!btnEdit) {
                btnEdit = document.createElement('button')
                btnEdit.id = 'btn-editar-unico' 
                btnEdit.className = "btn btn-primary mx-3"
                btnEdit.innerHTML = 'Editar'
                divBtn.appendChild(btnEdit)
            }

            btnEdit.onclick = (() => {

                d.ano = inputAno.value 
                d.mes = inputMes.value 
                d.dia = inputDia.value 
                d.tipo = inputTipo.value 
                d.descricao = inputDescricao.value 
                d.valor = inputValor.value 

                localStorage.setItem(d.id, JSON.stringify(d))

                window.location.reload()
            })
        })
        row.insertCell(5).append(btn2)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}



