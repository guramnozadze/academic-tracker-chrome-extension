let extracted_point_credit_pairs = []; // [[POINT, CREDIT]]

// Extracting points and credits from table (only finished classes)
const table = document.querySelector('table');
if(!window.location.href.includes("course/scores")){
    if (table) {
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

function showCourseGpaAfterTable(table){
    if(!table){
        return;
    }

    // Select all rows in the table body
    let rows = table.querySelectorAll("tbody tr");

    // Get the last two rows
    let lastTwoRows = Array.from(rows).slice(-2);

    const point = lastTwoRows[0]?.querySelectorAll('td')?.[1]?.innerText ?? 0;
    const credit = lastTwoRows[1]?.querySelectorAll('td')?.[1]?.innerText ?? 0;
    if(credit > 0){
        let newRow = document.createElement("tr");
        // Create the first TD with class "warning"
        let td1 = document.createElement("td");
        td1.classList.add("success");
        let strong1 = document.createElement("strong");
        strong1.innerText = "GPA";
        td1.appendChild(strong1);

        // Create the second TD
        let td2 = document.createElement("td");
        let div = document.createElement("div");
        div.style.paddingLeft = "20px"; // Add inline style
        let strong2 = document.createElement("strong");
        strong2.innerText = ((Number(point) - 50) * 0.06 + 1).toFixed(2);
        div.appendChild(strong2);
        td2.appendChild(div);

        // Append TDs to the row
        newRow.appendChild(td1);
        newRow.appendChild(td2);

        // Append the row to the table body
        table.querySelector("tbody").appendChild(newRow)
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
                    // old text სემესტრული შეფასებების მინიმალური კომპეტენციის ზღვარი | 40/16.4
                    barrierParagraphElement.innerHTML = `ყველა აქტივობის ჯამი, გარდა შუალედურისა - ფინალურზე დასაშვები ზღვარი - <b>${barrierValue}</b>`;
                }

                if (index === 1) {
                    // old text შუალედური შეფასებების მინიმალური კომპეტენციის ზღვარი | 70/28.7
                    barrierParagraphElement.innerHTML = `ყველა აქტივობისა და შუალედურის ჯამი - ფინალურზე დასაშვები ზღვარი - <b>${barrierValue}</b>`;
					insertExclamationIconInfo(barrierParagraphElement, barrierValue)
                }


                // Change color based on whether it meets the minimum barrier
                if (currentValue >= barrierValue) {
                    progressBar.style.backgroundColor = '#28a745'; // Green for pass
					progressBar.setAttribute('title', `${barrierValue} ქულიანი ბარიერი გადალახულია`);
                } else {
					// Insert absolute green dash representing barrier
                    const barrierIndicator = document.createElement('div');
                    barrierIndicator.title = `ბარიერი - ${barrierValue}`;
                    barrierIndicator.style.position = 'absolute';
                    barrierIndicator.style.left = `${(barrierValue / maxValue) * 100}%`;
                    barrierIndicator.style.height = '100%';
                    barrierIndicator.style.width = '2px';  // width of the dash
                    barrierIndicator.style.backgroundColor = '#28a745';  // Bootstrap success green
                    barrierIndicator.style.zIndex = '1';   // ensure it's above the progress bar
                    progressBar.parentElement.appendChild(barrierIndicator);

                }

                // ** Injecting max value inside progress bar
                // ** Injecting max value inside progress bar
                // ** Injecting max value inside progress bar
                progressBar.parentElement.style.position = 'relative'

                // Create and style the max value element
                const maxValueDiv = document.createElement('div');
                maxValueDiv.style.position = 'absolute';
                maxValueDiv.style.right = '16px';
                maxValueDiv.style.top = '0';
                if(currentValue >= maxValue){
                    maxValueDiv.textContent = `PERFECT`;
                    maxValueDiv.style.color = "#FFF"
                }else{
                    maxValueDiv.textContent = `(მაქს: ${maxValue})`;
                }
                // maxValueDiv.style.color = '#6c757d'; // Bootstrap secondary color
                maxValueDiv.style.fontSize = '1rem'; // 14px
                maxValueDiv.style.lineHeight = progressBar.offsetHeight + 'px'; // Center vertically

                progressBar.parentElement.appendChild(maxValueDiv);
            }
        }
    }


    //     INSERT GPA IN TABLE
    //     INSERT GPA IN TABLE
    //     INSERT GPA IN TABLE
    const table = document.querySelector('table');
    showCourseGpaAfterTable(table)
}


function insertExclamationIconInfo(element, minBarrier){

	if(!element){
		return
	}

	// TEXT ICON
	const warningText = `შენიშვნა: თუ შუალედურში ჩაიჭერი, სხვა აქტივობებით დაგროვებული ${minBarrier || "მინიმალურ"} ქულა საკმარისი იქნება ფინალურზე გასასვლელად! თუ ფიქრობ რომ ვერ დააგროვებ რეკომენდირებულია დროულად! - ლექტორთან დალაპარაკება ან მეილზე მიწერა.`
	const warningIcon = document.createElement('i');
	warningIcon.className = 'icon-info-sign';
	warningIcon.setAttribute('title', warningText);

	// Add a unique class to the icon
	warningIcon.className += ' guram-nozadze-warning-icon';

	// Add style rules
		const style = document.createElement('style');
		style.textContent = `
		.guram-nozadze-warning-icon {
			padding-left: 8px;
			cursor: help;
			opacity: 0.55;
			transition: opacity 0.2s ease;
		}
		.guram-nozadze-warning-icon:hover {
			opacity: 1;
		}
	`;
	document.head.appendChild(style);

	// warningIcon.style.color = '#ffc107'; // Warning yellow color

	// Find parent element and append the icon
	// const parentElement = barriers[0].parentElement;
	// const headingText = document.createElement('div');
	// headingText.className = 'fw-bold mb-3'; // Bootstrap classes for bold text and margin
	// headingText.textContent = 'შეფასების კომპონენტები და ბარიერები';
	// headingText.appendChild(warningIcon);

	// Insert heading before the barriers
	element.appendChild(warningIcon);
}

