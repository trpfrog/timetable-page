function dayOfWeekToCSSColumn(dayOfWeek) {
    switch (dayOfWeek) {
        case 'mon': return 2;
        case 'tue': return 3;
        case 'wed': return 4;
        case 'thu': return 5;
        case 'fri': return 6;
        case 'sat': return 7;
    }
    return 1;
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
    const needsSlash = lecture.teacher !== '' && lecture.type !== '';
    const windowColor = lecture.color === ''  ? '' : `background-color: ${lecture.color};`;

    return `
        <div 
            class="timetable-lecture-shell" 
            style="
                grid-column: ${dayOfWeekToCSSColumn(lecture.day_of_week)};
                grid-row: ${1 + lecture.period} / ${1 + lecture.period + lecture.lect_length};
            "
        >
        
            <!-- Time notation for smartphones --->
            <div class="timetable-period-mobile-shell">
                ${[...Array(lecture.lect_length).keys()].map(i => (`
                    <div class="timetable-heading timetable-period-mobile centering">
                        <div class="timetable-element-wrapper">
                            <p>${time[lecture.period - 1 + i]}</p>
                        </div>
                    </div>
                `)).join('')}
            </div>
            
            <!-- Lecture block --->            
            <div class="timetable-element centering" style="${windowColor}">
                <div class="timetable-element-wrapper">
                    <p class="lecture-name">
                        <budoux-ja>${lecture.name}</budoux-ja>
                    </p>
                    <p>
                        ${lecture.teacher}${needsSlash ? ' / ' : ''}${lecture.type}
                    </p>
                    <div class="timetable-button-area">
                        ${Object.keys(SPECIFIC_FONT_AWESOME_CLASSES).map(e =>
                            buttonComponent(lecture[e], e)
                        ).join('\n')}
                        ${!lecture.custom ? '' : lecture.custom.map(customButton => (
                            buttonComponent(
                                customButton.url,
                                customButton.fa_class ? '' : customButton.fa_class                                
                            )
                        ))}
                        ${zoomIdPassButton(lecture.zoom_id, lecture.zoom_password)}
                        ${idPassButton(lecture.id, lecture.password)}
                    </div>
                </div>
            </div>
            
        </div>
    `;
}

function decomposeTimetable(timetable) {
  return timetable.flatMap(lect => {
    if (Array.isArray(lect.period)) {
      if (!Array.isArray(lect.lect_length)) {
        lect.lect_length = [lect.lect_length];
      }
      if (!Array.isArray(lect.day_of_week)) {
        lect.day_of_week = [lect.day_of_week];
      }
      let ret = [];
      for (let i = 0; i < lect.period.length; i++) {
        ret.push({
          ...lect,
          day_of_week: lect.day_of_week[i % lect.day_of_week.length],
          period: lect.period[i],
          lect_length: lect.lect_length[i % lect.lect_length.length],
        });
      }
      return ret;
    } else {
      return [lect];
    }
  });
}

function getDividedTimetable() {
    const alignedTimetable = day_of_weeks.map(() => []);
    const decomposedTimetable = decomposeTimetable(timetable);
    console.log(decomposedTimetable);

    for (const lect of decomposedTimetable) {
      if (dayOfWeekToCSSColumn(lect.day_of_week) <= 1) {
        console.log(`Invalid day of week: ${lect.day_of_week} (lecture: ${lect.name})`)
      }
    }
    decomposedTimetable
        .filter(lect => dayOfWeekToCSSColumn(lect.day_of_week) > 1)
        .map(lect => ({ i: dayOfWeekToCSSColumn(lect.day_of_week) - 2, lect }))
        .forEach(({i, lect}) => alignedTimetable[i].push(lect))

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

    const html = `
        ${day_of_weeks.map((e, i) => (`
            <!-- day of weeks --->
            <div 
                class="timetable-heading centering" 
                style="grid-column: ${2 + i}; grid-row: 1"
            >
                <div class="timetable-element-wrapper">
                    <p>${e}</p>
                </div>
            </div>
            
            <!-- lecture data --->
            ${lecturesInDay[i].map(lectureDataToHTML).join('')}
        `)).join('')}
        
        <!-- time notation --->
        ${time.map((e, i) => (`
            <div 
                class="timetable-heading timetable-period-pc centering" 
                style="grid-column: 1; grid-row: ${2 + i}"
            >
                <div class="timetable-element-wrapper">
                    <p>${e}</p>
                </div>
            </div>
        `)).join('')}
    `;
    tableElement.insertAdjacentHTML('beforeend', html);
}

document.addEventListener("DOMContentLoaded", () => {
    initTimetable();
});
