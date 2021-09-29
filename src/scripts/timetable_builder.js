function day_of_week_to_css_column(day_of_week) {
    switch (day_of_week) {
        case 'mon': return 2;
        case 'tue': return 3;
        case 'wed': return 4;
        case 'thu': return 5;
        case 'fri': return 6;
    }
    return 1;
};

function lecture_data_to_css(lecture) {
    return `
        grid-column: ${day_of_week_to_css_column(lecture.day_of_week)};
        grid-row: ${1 + lecture.period} / ${1 + lecture.period + lecture.lect_length}; `;
}

function button_centering(html) {
    // do nothing
    return html;
}

function classroom_btn(url) {
    if(url === '') return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fab fa-google"></i></a>`)
}

function home_btn(url) {
    if(url === '') return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fas fa-home"></i></a>`)
}

function zoom_btn(url) {
    if(url === '') return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fas fa-video"></i></a>`)
}

function lecture_data_to_html(lecture) {
    let needSlash = lecture.teacher != '' && lecture.type != '';
    let windowColor = lecture.color == ''  ? '' : `background-color: ${lecture.color};`;
    return `
    <div class="timetable-element centering" style="${lecture_data_to_css(lecture)}${windowColor}">
        <div class="timetable-element-wrapper">
            <p class="lecture-name">${lecture.name}</p>
            <p>${lecture.teacher}${needSlash ? ' / ' : ''}${lecture.type}</p>
            <div style="display: inline-block;">
                <p style="margin: 0;">
                    ${classroom_btn(lecture.google_classroom)}
                    ${home_btn(lecture.link)}
                    ${zoom_btn(lecture.zoom)}
                </p>
            </div>
        </div>
    </div>`;
}

function init_timetable() {
    const lects = timetable;
    const table = document.getElementById('timetable');
    document.getElementById('header_wrapper').innerHTML = '<h1>' + page_title + '</h1>';

    for (let i in day_of_weeks) {
        const html = `<div class="timetable-heading centering" style="grid-column: ${2 + parseInt(i)}; grid-row: 1">    
            <div class="timetable-element-wrapper">
                <p>${day_of_weeks[i]}</p>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', html);
    }

    for(const i in time) {
        const html = `<div class="timetable-heading centering" style="grid-column: 1; grid-row: ${2 + parseInt(i)}">
            <div class="timetable-element-wrapper">
                <p>${time[i]}</p>
            </div>
        </div>`;
        table.insertAdjacentHTML('beforeend', html);
    }

    for (const lecture of lects) {
        table.insertAdjacentHTML('beforeend', lecture_data_to_html(lecture));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init_timetable();
});
