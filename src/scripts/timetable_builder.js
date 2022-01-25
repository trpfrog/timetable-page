function dayOfWeekToCSSColumn(dayOfWeek) {
    switch (dayOfWeek) {
        case 'mon': return 2;
        case 'tue': return 3;
        case 'wed': return 4;
        case 'thu': return 5;
        case 'fri': return 6;
    }
    return 1;
};

function lectureDataToCSS(lecture) {
    return `
        grid-column: ${dayOfWeekToCSSColumn(lecture.day_of_week)};
        grid-row: ${1 + lecture.period} / ${1 + lecture.period + lecture.lect_length}; `;
}


const SPECIFIC_FONT_AWESOME_CLASSES = {
    google_classroom: 'fab fa-google',
    webclass: 'fas fa-school',
    link: 'fas fa-home',
    link2: 'fas fa-paperclip',
    zoom: 'fas fa-video',
}

function buttonComponent(url, fontAwesomeClass) {
    if(url === '' || url === undefined) return '';
    if(SPECIFIC_FONT_AWESOME_CLASSES[fontAwesomeClass] !== undefined) {
        fontAwesomeClass = SPECIFIC_FONT_AWESOME_CLASSES[fontAwesomeClass];
    }
    return `<a href="${url}" class="timetable-button"><i class="${fontAwesomeClass}"></i></a>`
}

function zoomIdPassButton(id, pass) {
    if((id === '' || id === undefined) && (pass === '' || pass === undefined)) return '';
    return `<span onclick="idPassPopup('${id}', '${pass}')" 
                        class="timetable-button"><i class="fas fa-video"></i></span>`;
}

function idPassButton(id, pass) {
    if((id === '' || id === undefined) && (pass === '' || pass === undefined)) return '';
    return `<span onclick="idPassPopup('${id}', '${pass}')" 
                        class="timetable-button"><i class="fas fa-id-card"></i></span>`;
}

function lecture_data_to_html(lecture) {
    let needSlash = lecture.teacher !== '' && lecture.type !== '';
    let windowColor = lecture.color === ''  ? '' : `background-color: ${lecture.color};`;
    
    let html = `<div class="timetable-lecture-shell" style="${lectureDataToCSS(lecture)}">
        <div class="timetable-period-mobile-shell">`;
    
    for(let i = 0; i < lecture.lect_length; i++) {
        html += `
            <div class="timetable-heading timetable-period-mobile centering">
                <div class="timetable-element-wrapper">
                    <p>${time[lecture.period - 1 + i]}</p>
                </div>
            </div>`;
    }

    html += `
        </div>
            <div class="timetable-element centering" style="${windowColor}">
                <div class="timetable-element-wrapper">
                    <p class="lecture-name">${lecture.name}</p>
                    <p>${lecture.teacher}${needSlash ? ' / ' : ''}${lecture.type}</p>
                    <div style="display: inline-block;">
                        <p style="margin: 0;">
                            ${Object.keys(SPECIFIC_FONT_AWESOME_CLASSES).map(e => 
                                buttonComponent(lecture[e], e)    
                            ).join('\n')}
                            ${zoomIdPassButton(lecture.zoom_id, lecture.zoom_password)}
                            ${idPassButton(lecture.id, lecture.password)}
                        </p>
                    </div>
                </div>
            </div>
        </div>`;
    
    html += '</div></div>'

    return html;
}

function getDividedTimetable() {
    const alignedTimetable = day_of_weeks.map(() => [])
    timetable
        .map(lect => ({ i: dayOfWeekToCSSColumn(lect.day_of_week) - 2, lect }))
        .map(({i, lect}) => alignedTimetable[i].push(lect))

    for (let i in alignedTimetable) {
        alignedTimetable[i].sort((a, b) => a.period - b.period);
    }
    return alignedTimetable;
}

function init_timetable() {
    const lects = getDividedTimetable();
    const table = document.getElementById('timetable');
    document.getElementById('header_wrapper').innerHTML = '<h1>' + page_title + '</h1>';

    const theme = (typeof color_theme === 'undefined' || color_theme === '') ? 'color.css' : color_theme;
    const themeCode = `@import "${theme}";`
    document.getElementsByTagName('style')[0].insertAdjacentHTML('afterbegin', themeCode);

    for (let i in day_of_weeks) {
        const html = `<div class="timetable-heading centering" style="grid-column: ${2 + parseInt(i)}; grid-row: 1">    
            <div class="timetable-element-wrapper">
                <p>${day_of_weeks[i]}</p>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', html);
        for(const lecture of lects[i]) {
            table.insertAdjacentHTML('beforeend', lecture_data_to_html(lecture));
        }
    }

    for(const i in time) {
        const html = `<div class="timetable-heading timetable-period-pc centering" style="grid-column: 1; grid-row: ${2 + parseInt(i)}">
            <div class="timetable-element-wrapper">
                <p>${time[i]}</p>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', html);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init_timetable();
});
