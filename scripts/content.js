// Calculate GPA per class (X is a point/qula) - GPA = (X-50) x 0,06+1.0
const table = document.querySelector('table');
let point_credit_pairs = []; // [[POINT, CREDIT]]
if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const tds = row.querySelectorAll('td');

        if (tds.length >= 2) {
            if (tds[3] && tds[5] && tds[0].classList.contains('text-success')) {
                const point = Number(tds[3].textContent.trim());
                const credit = Number(tds[5].textContent.trim());
                point_credit_pairs.push([point, credit]);
            }
        }
    });

    showGpaAfterElement(table, point_credit_pairs);
} else {
    console.log(table, "არჩეული კურსების TABLE Not Found");
}

function calculateGpa(point_credit_pairs) {  // [[POINT, CREDIT]]
    const credits_sum = point_credit_pairs.reduce((acc, curr) => acc + curr[1], 0)
    const points_sum = point_credit_pairs.reduce((acc, curr) => acc + curr[0], 0)

    // GPA(S) = Σ(GPA x CR) / ΣCR
    const gpa_times_credits_sum = point_credit_pairs.reduce((acc, curr) => {
            const point = curr[0];
            const credit = curr[1];
            const gpa_per_class = (point - 50) * 0.06 + 1

            const gpa_times_credit = gpa_per_class * credit;
            return acc + gpa_times_credit;
        }
        , 0)

    // GPA of finished classes so far
    return [gpa_times_credits_sum / credits_sum, points_sum, point_credit_pairs.length];
}

function showGpaAfterElement(element, point_credit_pairs) {
    if (element) {
        const [gpa_semester, points_sum, len] = calculateGpa(point_credit_pairs);
        console.log("chabarebuli sagnebis", gpa_semester)

        // შერჩევითი საშუალო კრედიტების წონის მიხედვიტ
        const weightedAverage = point_credit_pairs.reduce((acc, [point, credit]) => acc + (point * credit), 0) /
            point_credit_pairs.reduce((acc, [_, credit]) => acc + credit, 0);
        const weighted_average_p = document.createElement('p');
        weighted_average_p.textContent = `შერჩევითი საშუალო კრედიტების წონის მიხედვით ${weightedAverage.toFixed(2)}`;
        element.insertAdjacentElement('afterend', weighted_average_p);

        const averga_points = document.createElement('p');
        // averga_points.textContent = `საშუალო ქულა ${points_sum/len.toFixed(2)} - (${points_sum}/${len})`;
        averga_points.textContent = `საშუალო ქულა ${points_sum/len.toFixed(2)}`;
        element.insertAdjacentElement('afterend', averga_points);

        const finished_count_p = document.createElement('p');
        finished_count_p.textContent = `ჩაბარებული საგნები ${point_credit_pairs.length}`;
        element.insertAdjacentElement('afterend', finished_count_p);

        const badge = document.createElement('p');
        const boldText = document.createElement('b');
        badge.appendChild(boldText);
        // badge.textContent = `მიმდინარე GPA ${gpa_semester.toFixed(2)} - Σ(GPA x CR) / ΣCR` ;
        boldText.textContent = `მიმდინარე GPA ${gpa_semester.toFixed(2)}` ;
        element.insertAdjacentElement('afterend', badge);
    } else {
        console.log("not found element")
    }
}
