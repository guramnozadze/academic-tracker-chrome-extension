let extracted_point_credit_pairs = []; // [[POINT, CREDIT]]

// Extracting points and credits from table (only finished classes)
const table = document.querySelector('table');
if (table && !window.location.href.includes("course/scores")) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        const tds = row.querySelectorAll('td');

        if (tds.length >= 2) {
            if (tds[3] && tds[5] && tds[0].classList.contains('text-success')) {
                const point = Number(tds[3].textContent.trim());
                const credit = Number(tds[5].textContent.trim());
                extracted_point_credit_pairs.push([point, credit]);
            }
        }
    });

    showGpaAfterElement(table, extracted_point_credit_pairs);
} else {
    console.log(table, "არჩეული კურსების TABLE Not Found");
}

// Calculating GPA Σ(GPA x CR) / ΣCR
function calculateGpa(point_credit_pairs) {  // [[POINT, CREDIT]]
    const credits_sum = point_credit_pairs.reduce((acc, [_, credit]) => acc + credit, 0)
    const points_sum = point_credit_pairs.reduce((acc, [point, _]) => acc + point, 0)

    // GPA(S) = Σ(GPA x CR) / ΣCR
    const gpa_times_credits_sum = point_credit_pairs.reduce((acc, [point, credit]) => {
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
        console.log("chabarebuli sagnebis GPA", gpa_semester)

        // შერჩევითი საშუალო კრედიტების წონის მიხედვიტ
        const weightedAverage = point_credit_pairs.reduce((acc, [point, credit]) => acc + (point * credit), 0) /
            point_credit_pairs.reduce((acc, [_, credit]) => acc + credit, 0);
        const weighted_average_p = document.createElement('p');
        weighted_average_p.textContent = `შერჩევითი საშუალო ${weightedAverage.toFixed(2)} (${calcGradeLetter(points_sum / len)})`;
        element.insertAdjacentElement('afterend', weighted_average_p);

        const average_points_p = document.createElement('p');
        // average_points.textContent = `საშუალო ქულა ${points_sum/len.toFixed(2)} - (${points_sum}/${len})`;
        average_points_p.textContent = `საშუალო ქულა ${(points_sum/len).toFixed(2)} (${calcGradeLetter(points_sum/len)})`;
        element.insertAdjacentElement('afterend', average_points_p);

        const finished_count_p = document.createElement('p');
        finished_count_p.textContent = `ჩაბარებული საგნები ${point_credit_pairs.length}`;
        element.insertAdjacentElement('afterend', finished_count_p);

        // GPA(S) = Σ(GPA x CR) / ΣCR
        const gpa_p = document.createElement('p');
        const boldText = document.createElement('b');
        gpa_p.appendChild(boldText);
        // badge.textContent = `მიმდინარე GPA ${gpa_semester.toFixed(2)} - Σ(GPA x CR) / ΣCR` ;
        boldText.textContent = `მიმდინარე GPA ${gpa_semester.toFixed(2)}` ;
        element.insertAdjacentElement('afterend', gpa_p);
    } else {
        console.log("not found element")
    }
}


function calcGradeLetter(point){
    if(point === 100){
        return 'A+ Perfect'
    }
    if(point > 95){
        return 'A+'
    }
    if(point > 90){
        return 'A'
    }
    if(point > 85){
        return 'B+'
    }
    if(point > 80){
        return 'B'
    }
    if(point > 75){
        return 'C+'
    }
    if(point > 70){
        return 'C'
    }
    if(point > 65){
        return 'D+'
    }
    if(point > 60){
        return 'D'
    }
    if(point > 55){
        return 'C+'
    }
    if(point > 50){
        return 'C'
    }
    return ''
}

// Changing text and color of competence progress bar
if(window.location.href.includes("course/scores")) {
    const barriers = document.querySelectorAll('.barrier');
    if (barriers && barriers.length === 2) {

        for (const [index, barrierDiv] of barriers.entries()) {
            // New text that better explains this is for assignments/quizzes excluding midterm
            //  paragraphElement.textContent = "შუალედური გამოცდის გარდა, დანარჩენი აქტივობების (ქვიზები, დავალებები) მინიმალური ზღვარი | " + match[0] + "/" + match[1];


            // if(!currentValue){
            //     continue;
            // }

            // Get the progress bar and modify its color
            const progressBar = barrierDiv.querySelector('.progress-bar');
            if (progressBar) {
                // Get current and Max Barrier Value
                const currentValue = parseFloat(progressBar.getAttribute('aria-valuenow')).toFixed(2);
                const barrierValue = parseFloat(progressBar.getAttribute('aria-valuemax')).toFixed(2);

                // Change Text
                const barrierParagraphElement = barrierDiv.querySelector('p');
                const barrierText = barrierParagraphElement.textContent
                const match = barrierText.match(/\d+\.?\d*/g); // This will match numbers including decimals
                const maxValue = match ? parseFloat(match[0]) : 0; // Get the second number (18.86)


                if (index === 0) {
                    // barrierParagraphElement.textContent = barrierText.replace(barrierText, "შუალედური გამოცდის გარდა, დანარჩენი აქტივობების (ქვიზები, დავალებები) მინიმალური ზღვარი " + barrierValue + " ", "")
                    barrierParagraphElement.textContent = `${barrierValue} - შუალედური გამოცდის გარდა, დანარჩენი აქტივობების (ქვიზები, დავალებები და ა. შ.) მინიმალური ზღვარი | ` + maxValue + "/" + barrierValue + " (მაქს/მინ)";

                }

                if (index === 1) {
                    barrierParagraphElement.textContent = ` ${barrierValue} - ფინალურზე დასაშვებად საჭირო ქულა (ყველა აქტივობიდან) მინიმალური ზღვარი | ` + maxValue + "/" + barrierValue + " (მაქს/მინ)";
                }


                // Change color based on whether it meets the minimum barrier
                if (currentValue >= barrierValue) {
                    progressBar.style.backgroundColor = '#28a745'; // Green for pass
                    barrierDiv.setAttribute('title', `${barrierValue} ქულიანი ბარიერი გადალახულია`);
                } else {
                    progressBar.style.backgroundColor = '#dc3545'; // Red for fail
                }
            }
        }
    }
}