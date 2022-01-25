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

function lectureDataToHTML(lecture) {
    let needSlash = lecture.teacher !== '' && lecture.type !== '';
    let windowColor = lecture.color === ''  ? '' : `background-color: ${lecture.color};`;

    return `
        <div class="timetable-lecture-shell" style="${lectureDataToCSS(lecture)}">
        
            <!-- Time notation for smartphones --->
            <div class="timetable-period-mobile-shell">
                ${(() => {
                    // Generate time notations for the class length.
                    let smartphoneTimeNotation = '';
                    for(let i = 0; i < lecture.lect_length; i++) {
                        smartphoneTimeNotation += `
                        <div class="timetable-heading timetable-period-mobile centering">
                            <div class="timetable-element-wrapper">
                                <p>${time[lecture.period - 1 + i]}</p>
                            </div>
                        </div>`;
                    }
                    return smartphoneTimeNotation;
                })()}
            </div>
            
            <!-- Lecture block --->            
            <div class="timetable-element centering" style="${windowColor}">
                <div class="timetable-element-wrapper">
                    <p class="lecture-name">
                        ${lecture.name}
                    </p>
                    <p>
                        ${lecture.teacher}${needSlash ? ' / ' : ''}${lecture.type}
                    </p>
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
            
        </div>
    `;
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

function setPageTitle(pageTitle) {
    document.getElementById('header_wrapper').innerHTML = '<h1>' + pageTitle + '</h1>';
}

function setPageTheme(colorTheme) {
    const theme = (typeof colorTheme === 'undefined' || colorTheme === '') ? 'color.css' : colorTheme;
    const themeCode = `@import "${theme}";`
    document.getElementsByTagName('style')[0].insertAdjacentHTML('afterbegin', themeCode);
}

function initTimetable() {
    const lecturesInDay = getDividedTimetable();

    setPageTitle(page_title);
    setPageTheme(color_theme);

    const tableElement = document.getElementById('timetable');

    for (let i in day_of_weeks) {
        const className = 'timetable-heading centering';
        const style = `grid-column: ${2 + parseInt(i)}; grid-row: 1`;
        const html = `
            <div class="${className}" style="${style}">    
                <div class="timetable-element-wrapper">
                    <p>${day_of_weeks[i]}</p>
                </div>
            </div>`;
        tableElement.insertAdjacentHTML('beforeend', html);

        for(const lecture of lecturesInDay[i]) {
            tableElement.insertAdjacentHTML('beforeend', lectureDataToHTML(lecture));
        }
    }

    for(const i in time) {
        const className = 'timetable-heading timetable-period-pc centering';
        const style = `grid-column: 1; grid-row: ${2 + parseInt(i)}`;
        const html = `
            <div class="${className}" style="${style}">
                <div class="timetable-element-wrapper">
                    <p>${time[i]}</p>
                </div>
            </div>`;
        tableElement.insertAdjacentHTML('beforeend', html);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initTimetable();
});
