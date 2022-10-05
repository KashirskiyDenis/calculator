'use strict';

document.addEventListener('DOMContentLoaded', function () {
    let valueBox = document.getElementById('value');
    let historyBox = document.getElementById('history');
    let decor = document.getElementById('decor');
    let buttons = document.getElementsByClassName('button');

    let curValue = 0;
    let preValue = 0;
    let dotFlag = false;
    let operator = '';
    let operatorFlag = false;

    function changeDecor() {
        if (this.innerText == '🌙')
            this.innerText = '☼';
        else
            this.innerText = '🌙';

        document.getElementsByClassName('container')[0].classList.toggle('container-night');
        document.getElementsByClassName('button-backspace')[0].classList.toggle('button-backspace-night');
        document.getElementsByClassName('button-clear')[0].classList.toggle('button-clear-night');
        document.getElementById('title').classList.toggle('title-night');
    }

    function clear() {
        valueBox.innerText = '0';
        historyBox.innerText = '';
        curValue = 0;
        preValue = 0;
        dotFlag = false;
        operator = '';
        operatorFlag = false;
    }

    function backspace() {
        if (valueBox.innerText != '0')
            valueBox.innerText = valueBox.innerText.substring(0, valueBox.innerText.length - 1);

        if (valueBox.innerText.length == 0)
            valueBox.innerText = '0';
    }

    function percent() {
        if (historyBox.innerText == '')
            return;

        curValue = +valueBox.innerText;
        curValue = preValue / 100 * curValue;

        valueBox.innerText = +curValue.toString().substring(0, 8);
    }

    function calculate(op) {
        if (operatorFlag) {
            if (operator != op) {
                historyBox.innerText = historyBox.innerText.substring(0, historyBox.innerText.length - 1) + op;
                operator = op;
            }
            return;
        }
        if (operator != '' && operator != op) {
            calculate(operator);
            historyBox.innerText = historyBox.innerText.substring(0, historyBox.innerText.length - 1) + op;
            operator = op;
            return;
        }
        operator = op;
        operatorFlag = true;
        dotFlag = false;

        curValue = +valueBox.innerText;
        if (historyBox.innerText.length == 0) {
            preValue = curValue;
            valueBox.innerText = '0';
        } else {
            if (op == '÷')
                preValue = preValue / curValue;
            else if (op == 'x')
                preValue *= curValue;
            else if (op == '—')
                preValue -= curValue;
            else if (op == '+')
                preValue += curValue;

            preValue = +preValue.toString().substring(0, 8);
        }
        valueBox.innerText = preValue;
        historyBox.innerText += ` ${curValue} ${op}`;
    }

    function equalsSign() {
        if (operator)
            calculate(operator);

        const tmp = preValue;
        clear();
        valueBox.innerText = tmp;
    }

    function numberSign() {
        if (operatorFlag) {
            valueBox.innerText = '';
            operatorFlag = false;
        }

        if (valueBox.innerText.length < 8) {
            if (valueBox.innerText == '0')
                valueBox.innerText = ''
            valueBox.innerText += this.innerText;
        }
    }

    function dotSign() {
        if (dotFlag || valueBox.innerText.length >= 8) return;

        dotFlag = true;
        valueBox.innerText += '.';
    }

    function changeSign() {
        if (+valueBox.innerText < 0)
            valueBox.innerText = valueBox.innerText.substring(1, valueBox.innerText.length);
        else if (+valueBox.innerText > 0)
            valueBox.innerText = '-' + valueBox.innerText;
    }

    for (let button of buttons) {
        if (button.className == 'button button-change')
            button.addEventListener('click', changeSign);
        else if (button.className == 'button button-clear')
            button.addEventListener('click', clear);
        else if (button.className == 'button button-backspace')
            button.addEventListener('click', backspace);
        else if (button.className == 'button button-dot')
            button.addEventListener('click', dotSign);
        else if (button.className == 'button button-operator') {
            let operator = button.innerText;
            if (operator == '%')
                button.addEventListener('click', percent);
            else if (operator == '÷')
                button.addEventListener('click', () => calculate('÷'));
            else if (operator == 'x')
                button.addEventListener('click', () => calculate('x'));
            else if (operator == '—')
                button.addEventListener('click', () => calculate('—'));
            else if (operator == '+')
                button.addEventListener('click', () => calculate('+'));
            else if (operator == '=')
                button.addEventListener('click', equalsSign);
        }
        else
            button.addEventListener('click', numberSign);
    }

    decor.addEventListener('click', changeDecor);
});