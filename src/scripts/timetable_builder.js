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
    if(url === '' || url === undefined) return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fab fa-google"></i></a>`)
}

function home_btn(url) {
    if(url === '' || url === undefined) return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fas fa-home"></i></a>`)
}

function zoom_btn(url) {
    if(url === '' || url === undefined) return '';
    return button_centering(`<a href="${url}" class="timetable-button"><i class="fas fa-video"></i></a>`)
}

function zoomIdPassButton(id, pass) {
    if((id === '' || id === undefined) && (pass === '' || pass === undefined)) return '';
    const html = `<span onclick="idPassPopup('${id}', '${pass}')" 
                        class="timetable-button"><i class="fas fa-video"></i></span>`;
    return button_centering(html);
}

function lecture_data_to_html(lecture) {
    let needSlash = lecture.teacher != '' && lecture.type != '';
    let windowColor = lecture.color == ''  ? '' : `background-color: ${lecture.color};`;
    
    html = `<div class="timetable-lecture-shell" style="${lecture_data_to_css(lecture)}">
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
                            ${classroom_btn(lecture.google_classroom)}
                            ${home_btn(lecture.link)}
                            ${zoom_btn(lecture.zoom)}
                            ${zoomIdPassButton(lecture.zoom_id, lecture.zoom_password)}
                        </p>
                    </div>
                </div>
            </div>
        </div>`;
    
    html += '</div></div>'

    return html;
}

function get_divided_timetable() {
    let lects_each_day = {};
    for (let i in day_of_weeks) {
        lects_each_day[i] = [];
    }
    for (const lect of timetable) {
        lects_each_day[day_of_week_to_css_column(lect.day_of_week) - 2].push(lect);
    }
    var f = function (a, b) {
        return a.period - b.period;
    };
    for (let i in lects_each_day) {
        lects_each_day[i].sort(f);
    }
    return lects_each_day;
}

function init_timetable() {
    const lects = get_divided_timetable();
    const table = document.getElementById('timetable');
    document.getElementById('header_wrapper').innerHTML = '<h1>' + page_title + '</h1>';

    const theme = (typeof color_theme === 'undefined' || color_theme === '') ? 'default-color.css' : color_theme;
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
