const continueButton = document.getElementById("continue");
const main = document.getElementById("mainPage");

continueButton.addEventListener("click", () => {
    const pCount = parseInt(document.getElementById("paramsCount").value);
    const vCount = parseInt(document.getElementById("variantsCount").value);
    main.innerHTML = "";
    const form1 = document.createElement("form");
    form1.id = "parametersForm";

    for (let i = 0; i < pCount; i++) {
        const element = document.createElement("p");
        const name = "Параметр " + (i + 1) + ":";
        const inputName = "param" + i;
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text">
             </label>`;
        form1.appendChild(element);
    }

    const form2 = document.createElement("form");
    form2.id = "coefficientsForm";
    for (let i = 0; i < pCount; i++) {
        const element = document.createElement("p");
        const name = "Коэффициент " + (i + 1) + ":";
        const inputName = "coefficient" + i;
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text"">
             </label>`;
        form2.appendChild(element);
    }

    const form3 = document.createElement("form");
    form3.id = "variantsForm";
    for (let i = 0; i < vCount; i++) {
        const element = document.createElement("p");
        const name = "Вариант " + (i + 1) + ":";
        const inputName = "variant" + i;
        element.innerHTML =
            `<b>${name}</b><br>
             <label>
                <input id="${inputName}" type="text">
             </label>`;
        form3.appendChild(element);
    }

    const block = document.createElement("div");
    block.id = "block";
    block.appendChild(form1);
    block.appendChild(form2);
    block.appendChild(form3);
    main.appendChild(block);
    const buttonContinue = document.createElement("input");
    buttonContinue.id = "continue2";
    buttonContinue.type = "submit";
    buttonContinue.value = "Продолжить";
    buttonContinue.addEventListener("click", () => continue1(pCount, vCount));

    main.appendChild(buttonContinue);
})

function continue1(paramsCount, variantsCount) {
    const params = [paramsCount];
    const coeffs = [paramsCount];
    const vars = [variantsCount];
    for (let i = 0; i < paramsCount; i++) {
        let inputName = "param" + i;
        params[i] = document.getElementById(inputName).value;
        inputName = "coefficient" + i;
        coeffs[i] = document.getElementById(inputName).value;
        inputName = "variant" + i;
        vars[i] = document.getElementById(inputName).value;
    }

    for (let i = 0; i < variantsCount; i++) {
        let inputName= "variant" + i;
        vars[i] = document.getElementById(inputName).value;
    }
    main.innerHTML = "";

    const table = document.createElement("table");
    table.id = "prefsForm";
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    tr.innerHTML = `<th>Варианты</th>`;
    for (let i = 0; i < variantsCount; i++) {
        tr.innerHTML = tr.innerHTML.concat(
            `<th>${vars[i]}</th>`
        );
    }
    tr.innerHTML = tr.innerHTML.concat(`<th>Какое значение приоритетнее?</th>`);
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 0; i < paramsCount; i++) {
        const tr = document.createElement("tr");
        tr.id = "subform" + i;
        for (let j = 0; j < variantsCount; j++) {
            if (j === 0) {
                tr.innerHTML = `<th>${params[i]}</th>`;
            }
            const element = document.createElement("td");
            const inputName = "pref" + i + j;
            element.innerHTML = element.innerHTML.concat(
                `<label>
                    <input id="${inputName}" type="text" size="40">
                </label>`
            );
            tr.appendChild(element);
        }
        const lastColumn = document.createElement("td");
        const checkbox = document.createElement("form");
        checkbox.id = "minmaxForm" + i;
        checkbox.className = "minmaxForm";
        checkbox.innerHTML = checkbox.innerHTML.concat(
            `<p><input id="min-${i}" name="minmax-${i}" type="radio" value="min" checked>Меньше</p>
             <p><input id="max-${i}" name="minmax-${i}" type="radio" value="max">Больше</p>`
        );
        lastColumn.appendChild(checkbox);
        tr.appendChild(lastColumn);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    main.appendChild(table);
    const buttonContinue = document.createElement("input");
    buttonContinue.id = "continue3";
    buttonContinue.type = "submit";
    buttonContinue.value = "Продолжить";
    buttonContinue.addEventListener("click", () => continue2(paramsCount, variantsCount, params,
        coeffs, vars));

    main.appendChild(buttonContinue);
}

let res = "";

function continue2(paramsCount, variantsCount, params, coeffs, vars) {
    document.getElementById("continue3").style.display = "none";
    let prefsMatrix = [paramsCount];
    for (let i = 0; i < paramsCount; i++) {
        let row = [variantsCount];
        for (let j = 0; j < variantsCount; j++) {
            row[j] = 0;
        }
        prefsMatrix[i] = row;
    }
    let rating = [variantsCount];
    let ratingBlock = [variantsCount];
    let ratingTurnir = [variantsCount];
    let kmax = [variantsCount];
    let kopt = [variantsCount];
    for (let i = 0; i < variantsCount; i++) {
        rating[i] = 0;
        ratingBlock[i] = 0;
        ratingTurnir[i] = 0;
        kmax[i] = 0;
        kopt[i] = 0;
    }

    for (let i = 0; i < paramsCount; i++) {
        let prefs = [variantsCount];
        for (let j = 0; j < variantsCount; j++) {
            prefs[j] = document.getElementById("pref" + i + j).value;
        }
        prefsMatrix[i] = prefs;
    }
    let prep_bm = [paramsCount];
    for (let i = 0; i < paramsCount; i++) {
        let elements = document.getElementsByName("minmax-" + i);
        for (const el of elements) {
            if (el.checked)
                prep_bm[i] = el.value === "max";
        }
    }

    res += "Предпочтения:\n";
    for (let i = 0; i < paramsCount; ++i) {
        res += params[i] + ": " + coeffs[i] + "\n";
    }
    for (let k = 0; k < paramsCount; k++) {
        res += "\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n";
        res += params[k];

        let Dom_data = [paramsCount];
        for (let i = 0; i < paramsCount; i++) {
            let tmp = [variantsCount];
            for (let j = 0; j < variantsCount; j++) {
                tmp[j] = 0;
            }
            Dom_data[i] = tmp;
        }
        build_matrix(prefsMatrix[k], prep_bm[k], Dom_data, paramsCount);

        for (let i = 0; i < paramsCount; i++) {
            res +="\n";
            for (let j = 0; j < variantsCount; j++) {
                res += Dom_data[i][j] + "\t";
            }
        }

        let dom_Array = [];
        let block_Array = [];
        let turnir_Array = [];
        let kopt_Array = [variantsCount];
        for (let i = 0; i < variantsCount; i++) {
            kopt_Array[i] = -1;
        }
        let Karray = createKarray(Dom_data, paramsCount, variantsCount);
        createKopt(Karray, variantsCount, kopt_Array);
        res += "\nKopt";
        for (let i = 0; i < variantsCount; ++i) {
            res += "\n[" + i + "] = " + kopt_Array[i];
        }
        res += "\n+++++++";
        res += "\nK-max механизм\n";
        writeArrKopt(Karray, variantsCount, 4, kopt_Array);
        res += "\n======== ";
        dom_Array = dominate(Dom_data, paramsCount, variantsCount);
        block_Array = block(Dom_data, paramsCount, variantsCount);
        turnir_Array = turnir(Dom_data, coeffs, paramsCount, variantsCount, k);
        res += "\nДоминирующий механизм\n";
        for (let i = 0; i < dom_Array.length; ++i) {
            res += dom_Array[i];
            res += "\n";
            rating[dom_Array[i]] += +coeffs[k];
        }
        res += "\nБлокирующий механизм\n";
        for (let i = 0; i < block_Array.length; ++i) {
            res += block_Array[i];
            res += "\n";
            ratingBlock[block_Array[i]] += +coeffs[k];
        }

        res += "\nТурнирный механизм\n";
        for (let i = 0; i < turnir_Array.length; ++i) {
            res += turnir_Array[i];
            res += "\n";
            ratingTurnir[i] += +turnir_Array[i];
        }

        for (let i = 0; i < variantsCount; ++i) {
            for (let j = 0; j < 4; j++) {
                kmax[i] += +Karray[i][j] * +coeffs[k];
            }
        }
        for (let i = 0; i < variantsCount; ++i) {
            if ((kopt_Array[i] === 1) || (kopt_Array[i] === 2) || (kopt_Array[i] === 3) || (kopt_Array[i] === 4)) {
                for (let j = 0; j < 4; j++) {
                    kopt[i] += +Karray[i][j] * +coeffs[k];
                }
            }
        }
    }

    let rating_place = [variantsCount];
    placeRating(rating, rating_place, variantsCount);
    res += "\n_____Механизм доминирования_____";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < variantsCount; ++i) {
        res += vars[i] + " \t " + rating[i] + " \t " + rating_place[i] + "\n";
    }
    let rating_place_block = [variantsCount];
    placeRating(ratingBlock, rating_place_block, variantsCount);
    res += "\n_____Механизм блокировки______" ;
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < variantsCount; ++i) {
        res += vars[i] + " \t " + ratingBlock[i] + " \t " + rating_place_block[i] + "\n";
    }
    let rating_place_turnir = [variantsCount];
    placeRating(ratingTurnir, rating_place_turnir, variantsCount);
    res += "\n______Турнирный механизм______";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < variantsCount; ++i) {
        res += vars[i] + " \t " + ratingTurnir[i] + " \t " + rating_place_turnir[i] + "\n";
    }
    let rating_place_kmax = [variantsCount];
    let rating_place_kopt = [variantsCount];
    placeRating(kmax, rating_place_kmax, variantsCount);
    placeRating(kopt, rating_place_kopt, variantsCount);
    res += "\n______Механизм K-MAX______";
    res += "\nБаллы вариантов с учетом весовых коэффициентов и места вариантов\n";
    for (let i = 0; i < variantsCount; ++i) {
        res += vars[i] + " \t " + rating_place_kmax[i] + " \t " + kopt[i] + " \t " + rating_place_kopt[i] + "\n";
    }
    res += "\n______Бальная система______";

    res += "\n================================================================= ==============";
    res += "\n || Блок || Дом || Тур || Sjp || SjM || Сумма баллов ||";
    res += "\n================================================================= ==============\n";
    let winner = variantsCount + 1 - +rating_place[0] + variantsCount + 1 - +rating_place_block[0] +
        variantsCount + 1 - +rating_place_turnir[0] + variantsCount + 1 - +rating_place_kmax[0] + variantsCount + 1
        - +rating_place_kopt[0];
    let index = 0;
    for (let i = 1; i < variantsCount; ++i) {
        let dom_value = variantsCount + 1 - +rating_place[i];
        let block_value = variantsCount + 1 - +rating_place_block[i];
        let turn_value = variantsCount + 1 - +rating_place_turnir[i];
        let kmax_value = variantsCount + 1 - +rating_place_kmax[i];
        let kopt_value = variantsCount + 1 - +rating_place_kopt[i];
        let sum = +dom_value + +block_value + +turn_value + +kmax_value + +kopt_value;
        if (winner < sum) {
            winner = sum;
            index = i;
        }
    }
    let maxSum = -1;
    let bestVar = -1;
    for (let i = 0; i < variantsCount; ++i) {
        let dom_value = variantsCount + 1 - +rating_place[i];
        let block_value = variantsCount + 1 - +rating_place_block[i];
        let turn_value = variantsCount + 1 - +rating_place_turnir[i];
        let kmax_value = variantsCount + 1 - +rating_place_kmax[i];
        let kopt_value = variantsCount + 1 - +rating_place_kopt[i];
        let sum = +dom_value + +block_value + +turn_value + +kmax_value + +kopt_value;
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
    bestResult.appendChild(showMore);
    main.appendChild(bestResult);
}

function build_matrix(vars, greater, matrix, paramsCount) {
    for (let i = 0; i < vars.length; ++i ) {
        for (let j = 0; j < paramsCount.length; ++j) {
            if (i === j) {
                matrix[i][j] = -1;
                continue;
            }
            if (!greater && vars[i] <= vars[j] ) {
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
    let ind = 0;
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
            dom_str_Array[ind] = i;
            ind++;
        }
    }
    return dom_str_Array;
}

function block(arr, n, m) {
    let tmp = [];
    let ind = 0;
    let block_str;
    for (let i = 0; i < n; i++) {
        block_str = true;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] !== 0) {
                block_str = false;
                break;
            }
        }
        if (block_str) {
            tmp[ind] = i;
            ind++;
        }
    }
    return tmp;
}

function turnir(arr, power, n, m,  number) {
    let tmp = [];
    let ind = 0;
    let turnir_str;
    for (let i = 0; i < n; i++) {
        let sum = 0.0;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] === 1) {
                if (arr[j][i] === 0) {
                    sum += +power[number];
                }
                else if (arr[j][i] === 1) {
                    sum += +(power[number] / 2);
                }
            }
        }
        tmp[ind] = sum;
        ind++;
    }
    return tmp;
}

function createKarray(arr, n, m) {
    let A = [m];
    for (let i = 0; i < m; i++) {
        let tmp = [4];
        for (let j = 0; j < 4; j++) {
            tmp[j] = 0;
        }
        A[i] = tmp;
    }
    for (let i = 0; i < n; i++) {
        let HR0 = 0;
        let ER = 0;
        let NK = 0;
        for (let j = 0; j < m; j++) {
            if (i === j)
                continue;
            if (arr[i][j] === 1) {
                if (arr[j][i] === 0) {
                    HR0 += 1;
                } else if (arr[j][i] === 1) {
                    ER += 1;
                }
            }
            if (arr[i][j] === -1) {
                NK += 1;
            }
        }
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0:
                    A[i][j] = HR0 + ER + NK; break;
                case 1:
                    A[i][j] = HR0 + NK; break;
                case 2:
                    A[i][j] = HR0 + ER; break;
                case 3:
                    A[i][j] = HR0; break;
                default: break;
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

function placeRating(arr, A, vCount) {
    let place = [vCount];

    let number = [vCount];
    for (let i = 0; i < vCount; ++i) {
        number[i] = +(i + 1);
    }
    for (let i = 0; i < vCount; i++) {
        place[i] = +arr[i];
    }
    place.sort();
    place.reverse();

    let pl = 0;
    for (let i = 0; i < vCount; ++i) {
        if ((place[i] === place[i - 1]) && (i !== 0)) {
            continue;
        }
        for (let j = 0; j < vCount; j++) {
            if (arr[j] === place[i]) {
                A[j] = number[pl];
            }
        }
        pl++;
        if (place[i] === 0)
            break;
    }
}

//вывести двумерный массив K-opt механизм
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