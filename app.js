const continueButton = document.getElementById("continue");
const main = document.getElementById("mainPage");

const pref = [
    [143000, 150000, 148000],
    [2008, 2009, 2009],
    [170000, 140000, 150000]
];
const values = [0.3, 0.3, 0.4];
let res = "";
let prefCount = 0;
let varCount = 0;

continueButton.addEventListener("click", () => {
    prefCount = parseInt(document.getElementById("prefsCount").value);
    varCount = parseInt(document.getElementById("variantsCount").value);
    main.innerHTML = "";
    const paramsCountForm = document.createElement("form");
    paramsCountForm.id = "parametersForm";

    for (let i = 0; i < prefCount; i++) {
        const element = document.createElement("p");
        const name = "Предпочтение " + (i + 1) + ":";
        const inputName = "param" + i;
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text" value="${inputName}">
             </label>`;
        paramsCountForm.appendChild(element);
    }

    const coefficientsForm = document.createElement("form");
    coefficientsForm.id = "coefficientsForm";
    for (let i = 0; i < prefCount; i++) {
        const element = document.createElement("p");
        const name = "Коэффициент " + (i + 1) + ":";
        const inputName = "coefficient" + i;
        const value = prefCount === 3 ? values[i] : " ";
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text" value="${value}">
             </label>`;
        coefficientsForm.appendChild(element);
    }

    const variantsForm = document.createElement("form");
    variantsForm.id = "variantsForm";
    for (let i = 0; i < varCount; i++) {
        const element = document.createElement("p");
        const name = "Вариант " + (i + 1) + ":";
        const inputName = "variant" + i;
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text" value="${inputName}">
             </label>`;
        variantsForm.appendChild(element);
    }

    const block = document.createElement("div");
    block.id = "block";
    block.appendChild(paramsCountForm);
    block.appendChild(coefficientsForm);
    block.appendChild(variantsForm);
    main.appendChild(block);
    const buttonContinue = document.createElement("input");
    buttonContinue.id = "continue2";
    buttonContinue.type = "submit";
    buttonContinue.value = "Продолжить";
    buttonContinue.addEventListener("click", () => continue1());

    main.appendChild(buttonContinue);
})

function continue1() {
    const prefs = [prefCount];
    const coeffs = [prefCount];
    const vars = [varCount];
    for (let i = 0; i < prefCount; i++) {
        let inputName = "param" + i;
        prefs[i] = document.getElementById(inputName).value;
        inputName = "coefficient" + i;
        coeffs[i] = parseFloat(document.getElementById(inputName).value.replaceAll(",", "."));
    }

    for (let i = 0; i < varCount; i++) {
        let inputName = "variant" + i;
        vars[i] = document.getElementById(inputName).value;
    }
    main.innerHTML = "";

    const table = document.createElement("table");
    table.id = "prefsForm";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = `<th>Варианты</th>`;
    for (let i = 0; i < varCount; i++) {
        tr.innerHTML = tr.innerHTML.concat(
            `<th>${vars[i]}</th>`
        );
    }
    tr.innerHTML = tr.innerHTML.concat(`<th>Какое значение приоритетнее?</th>`);
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < prefCount; i++) {
        const tr = document.createElement("tr");
        tr.id = "subform" + i;
        for (let j = 0; j < varCount; j++) {
            if (j === 0) {
                tr.innerHTML = `<th>${prefs[i]}</th>`;
            }
            const element = document.createElement("td");
            const inputName = "pref" + i + j;
            const value = (prefCount === 3 && varCount === 3) ? pref[i][j] : " ";
            element.innerHTML = element.innerHTML.concat(
                `<label>
                    <input id="${inputName}" type="text" size="40" value="${value}">
                </label>`
            );
            tr.appendChild(element);
        }
        const lastColumn = document.createElement("td");
        const radioForm = document.createElement("form");
        radioForm.id = "minmaxForm" + i;
        radioForm.className = "minmaxForm";
        radioForm.innerHTML = radioForm.innerHTML.concat(
            `<p><input id="min-${i}" name="minmax-${i}" type="radio" value="min" checked>Меньше</p>
             <p><input id="max-${i}" name="minmax-${i}" type="radio" value="max">Больше</p>`
        );
        lastColumn.appendChild(radioForm);
        tr.appendChild(lastColumn);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    main.appendChild(table);
    const buttonContinue = document.createElement("input");
    buttonContinue.id = "continue3";
    buttonContinue.type = "submit";
    buttonContinue.value = "Продолжить";
    buttonContinue.addEventListener("click", () => continue2(prefs, coeffs, vars));

    main.appendChild(buttonContinue);
}

function continue2(params, coeffs, vars) {
    document.getElementById("continue3").style.display = "none";
    let prefsMatrix = new Array(pref).fill().map(() =>
        new Array(varCount).fill(0));
    let rating = new Array(varCount).fill(0);
    let ratingBlock = new Array(varCount).fill(0);
    let ratingTurnir = new Array(varCount).fill(0);
    let kmax = new Array(varCount).fill(0);
    let kopt = new Array(varCount).fill(0);

    for (let i = 0; i < prefCount; i++) {
        const prefs = [varCount];
        for (let j = 0; j < varCount; j++) {
            prefs[j] = document.getElementById("pref" + i + j).value;
        }
        prefsMatrix[i] = prefs;
    }
    const prep_bm = [prefCount];
    for (let i = 0; i < prefCount; i++) {
        const elements = document.getElementsByName("minmax-" + i);
        for (const el of elements) {
            if (el.checked)
                prep_bm[i] = el.value === "max";
        }
    }

    res += "Предпочтения:\n";
    for (let i = 0; i < prefCount; i++) {
        res += params[i] + ": " + coeffs[i] + "\n";
    }
    for (let k = 0; k < prefCount; k++) {
        res += "\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n";
        res += params[k];

        const Dom_data = new Array(varCount).fill().map(() =>
            new Array(varCount).fill(0));

        build_matrix(prefsMatrix[k], prep_bm[k], Dom_data);

        for (let i = 0; i < varCount; i++) {
            res += "\n";
            for (let j = 0; j < varCount; j++) {
                res += Dom_data[i][j] + "\t";
            }
        }

        let kopt_Array = new Array(varCount).fill(-1);
        let Karray = createKarray(Dom_data, varCount, varCount);
        createKopt(Karray, varCount, kopt_Array);
        res += "\nKopt";
        for (let i = 0; i < varCount; i++) {
            res += "\n[" + i + "] = " + kopt_Array[i];
        }
        res += "\n+++++++";
        res += "\nK-max механизм\n";
        writeArrKopt(Karray, varCount, 4, kopt_Array);
        res += "\n======== ";
        const dom_Array = dominate(Dom_data, varCount, varCount);
        const block_Array = block(Dom_data, varCount, varCount);
        const turnir_Array = turnir(Dom_data, coeffs, varCount, varCount, k);
        res += "\nДоминирующий механизм\n";
        for (let i = 0; i < dom_Array.length; i++) {
            res += dom_Array[i];
            res += "\n";
            rating[dom_Array[i]] += +coeffs[k];
        }
        res += "\nБлокирующий механизм\n";
        for (let i = 0; i < block_Array.length; i++) {
            res += block_Array[i];
            res += "\n";
            ratingBlock[block_Array[i]] += +coeffs[k];
        }

        res += "\nТурнирный механизм\n";
        for (let i = 0; i < turnir_Array.length; i++) {
            res += turnir_Array[i];
            res += "\n";
            ratingTurnir[i] += +turnir_Array[i];
        }

        for (let i = 0; i < varCount; i++) {
            for (let j = 0; j < 4; j++) {
                kmax[i] += +Karray[i][j] * +coeffs[k];
            }
        }
        for (let i = 0; i < varCount; i++) {
            if ((kopt_Array[i] === 1) || (kopt_Array[i] === 2) || (kopt_Array[i] === 3) || (kopt_Array[i] === 4)) {
                for (let j = 0; j < 4; j++) {
                    kopt[i] += +Karray[i][j] * +coeffs[k];
                }
            }
        }
    }

    const rating_place = [varCount];
    placeRating(rating, rating_place);
    res += "\n_____Механизм доминирования_____";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < varCount; i++) {
        res += vars[i] + " \t " + rating[i] + " \t " + rating_place[i] + "\n";
    }
    const rating_place_block = [varCount];
    placeRating(ratingBlock, rating_place_block);
    res += "\n_____Механизм блокировки______";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < varCount; i++) {
        res += vars[i] + " \t " + ratingBlock[i] + " \t " + rating_place_block[i] + "\n";
    }
    const rating_place_turnir = [varCount];
    placeRating(ratingTurnir, rating_place_turnir);
    res += "\n______Турнирный механизм______";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < varCount; i++) {
        res += vars[i] + " \t " + ratingTurnir[i] + " \t " + rating_place_turnir[i] + "\n";
    }
    const rating_place_kmax = [varCount];
    const rating_place_kopt = [varCount];
    placeRating(kmax, rating_place_kmax);
    placeRating(kopt, rating_place_kopt);
    res += "\n______Механизм K-MAX______";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < varCount; i++) {
        res += vars[i] + " \t " + rating_place_kmax[i] + " \t " + kopt[i] + " \t " + rating_place_kopt[i] + "\n";
    }
    res += "\n______Бальная система______";

    res += "\n================================================================= ==============";
    res += "\n || Блок || Дом || Тур || Sjp || SjM || Сумма баллов ||";
    res += "\n================================================================= ==============\n";

    let maxSum = -1;
    let bestVar = -1;
    const sums = [varCount];
    for (let i = 0; i < varCount; i++) {
        let dom_value = varCount + 1 - +rating_place[i];
        let block_value = varCount + 1 - +rating_place_block[i];
        let turn_value = varCount + 1 - +rating_place_turnir[i];
        let kmax_value = varCount + 1 - +rating_place_kmax[i];
        let kopt_value = varCount + 1 - +rating_place_kopt[i];
        let sum = +dom_value + +block_value + +turn_value + +kmax_value + +kopt_value;
        sums[i] = sum;
        res += "\n" + vars[i] + " \t " + block_value + " \t " + dom_value + " \t " + turn_value + " \t " + kmax_value
            + " \t " + kopt_value + " \t " + sum;
        if (sum > maxSum) {
            maxSum = sum;
            bestVar = i;
        }
    }
    const bestResult = document.createElement("div");
    bestResult.id = "bestRes";
    bestResult.innerHTML = `<p>${vars[bestVar]}</p>`;
    const showMore = document.createElement("input");
    showMore.id = "showMore";
    showMore.type = "submit";
    showMore.value = "Показать подробный вывод";
    showMore.addEventListener("click", () => {
        document.getElementById("showMore").style.display = "none";
        const resElement = document.createElement("div");
        resElement.innerText = res;
        main.appendChild(resElement);
    });
    getFinalTable(vars, sums, bestResult);
    bestResult.appendChild(showMore);
    main.appendChild(bestResult);
}

function getFinalTable(vars, sums, element) {
    const table = document.createElement("table");
    table.id = "finalResults";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <th>Варианты</th>
        <th>Сумма баллов</th>`;
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < varCount; i++) {
        const tr = document.createElement("tr");
        tr.id = "row" + i;
        tr.innerHTML = `<th>${vars[i]}</th>`;
        let element = document.createElement("td");
        let inputName = "sum" + i;
        element.innerHTML = element.innerHTML.concat(
            `<p id="${inputName}">${sums[i]}</p>`
        );
        tr.appendChild(element);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    element.appendChild(table);
}

function build_matrix(vars, greater, matrix) {
    for (let i = 0; i < vars.length; i++) {
        for (let j = 0; j < vars.length; j++) {
            if (i === j) {
                matrix[i][j] = -1;
                continue;
            }
            if (!greater && vars[i] <= vars[j]) {
                matrix[i][j] = 1;
                continue;
            }
            if (greater && vars[i] >= vars[j]) {
                matrix[i][j] = 1;
            }
        }
    }
}

function dominate(arr, n, m) {
    let dom_str_Array = [];
    let dom_str;
    for (let i = 0; i < n; i++) {
        dom_str = true;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] !== 1) {
                dom_str = false;
                break;
            }
        }
        if (dom_str) {
            dom_str_Array.push(i);
        }
    }
    return dom_str_Array;
}

function block(arr, n, m) {
    let tmp = [];
    let block_str;
    for (let i = 0; i < n; i++) {
        block_str = true;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[j][i] !== 0) {
                block_str = false;
                break;
            }
        }
        if (block_str) {
            tmp.push(i);
        }
    }
    return tmp;
}

function turnir(arr, power, n, m, number) {
    let tmp = [];
    for (let i = 0; i < n; i++) {
        let sum = 0.0;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] === 1) {
                if (arr[j][i] === 0) {
                    sum += +power[number];
                } else if (arr[j][i] === 1) {
                    sum += +(power[number] / 2);
                }
            }
        }
        tmp.push(sum);
    }
    return tmp;
}

function createKarray(arr, n, m) {
    const A = new Array(m).fill().map(() =>
        new Array(4).fill(0));

    for (let i = 0; i < n; i++) {
        let HR0 = 0;
        let ER = 0;
        let NK = 0;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] === 1 && arr[j][i] === 0) {
                HR0 += 1;
            } else if (arr[i][j] === 1 && arr[j][i] === 1) {
                ER += 1;
            }
            if (arr[i][j] === -1) {
                NK += 1;
            }
        }
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0:
                    A[i][j] = HR0 + ER + NK;
                    break;
                case 1:
                    A[i][j] = HR0 + NK;
                    break;
                case 2:
                    A[i][j] = HR0 + ER;
                    break;
                case 3:
                    A[i][j] = HR0;
                    break;
                default:
                    break;
            }
        }
    }
    return A;
}

function createKopt(arr, n, kopt_Array) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0:
                    if (arr[i][j] === n) {
                        kopt_Array[i] = 1;
                    }
                    break;
                case 1:
                    if ((arr[i][j] === (n - 1)) && (arr[i][j] > arr[i][j + 2])) {
                        kopt_Array[i] = 2;
                    }
                    break;
                case 2:
                    if ((arr[i][j] === n) && (arr[i][j] > arr[i][j + 1])) {
                        kopt_Array[i] = 3;
                    }
                    break;
                case 3:
                    if ((arr[i][j] === (n - 1)) && (arr[i][j] === arr[i][j - 1]) && (arr[i][j] === arr[i][j - 2])) {
                        kopt_Array[i] = 4;
                    }
                    break;
                default:
                    kopt_Array[i] = 0;
                    break;
            }
        }
    }
}

function placeRating(arr, A) {
    let place = [varCount];

    let number = [varCount];
    for (let i = 0; i < varCount; i++) {
        number[i] = +(i + 1);
    }
    for (let i = 0; i < varCount; i++) {
        place[i] = +arr[i];
    }
    place.sort();
    place.reverse();

    let pl = 0;
    for (let i = 0; i < varCount; i++) {
        if ((place[i] === place[i - 1]) && (i !== 0)) {
            continue;
        }
        for (let j = 0; j < varCount; j++) {
            if (arr[j] === place[i]) {
                A[j] = number[pl];
            }
        }
        pl++;
        if (place[i] === 0)
            break;
    }
}

function writeArrKopt(arr, n, m, opt) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            res += +arr[i][j] + "\t";
        }
        switch (opt[i]) {
            case 0:
                break;
            case 1:
                res += "максимальный" + "\t";
                break;
            case 2:
                res += "строго максимальный" + "\t";
                break;
            case 3:
                res += "наибольший" + "\t";
                break;
            case 4:
                res += "строго наибольший" + "\t";
                break;
            default:
                break;
        }
        res += "\n";
    }
}