/*
    timetable-example.js

    [IMPORTANT]
    Firstly, rename this file to 'timetable.js'!
    It will not work without this operation!

    You can modify timetable to edit this file.
 */

const page_title = 'Timetable';
const time = ['9:00 - 10:30', '10:40 - 12:10', '13:00 - 14:30', '14:40 - 16:10', '16:15 - 17:45'];
const day_of_weeks = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const color_theme = '../color-themes/green-theme.css';

const timetable = [
    {
        "name": "Lecture name",
        "teacher": "Teacher",
        "day_of_week": "tue", // You can use [mon, tue, wed, thu, fri]
        "period": 2,
        "lect_length": 1,
        "type": "Realtime",
        "google_classroom": "https://trpfrog.net",
        "link": "https://trpfrog.net",
        "zoom": "https://trpfrog.net",
        "color": "",
    },
    {
        "name": "Long lecture",
        "teacher": "Teacher",
        "day_of_week": "thu",
        "period": 2,
        "lect_length": 3,
        "type": "Realtime",
        "google_classroom": "https://trpfrog.net",
        "link": "https://trpfrog.net",
        "zoom_id": "0123456789", // Video meeting id/pass
        "zoom_password": "9876543210",
        "color": "",
    },
    {
        "name": "Colored Lecture",
        "teacher": "Teacher",
        "day_of_week": "wed",
        "period": 3,
        "lect_length": 1,
        "type": "Realtime",
        "webclass": "https://trpfrog.net",
        "link1": "https://trpfrog.net",
        // You can use CSS style color including color code (#90e200) and rgba function.
        "color": "skyblue"
    },
    {
        "name": "ID/pass Website",
        "teacher": "Teacher",
        "day_of_week": "tue",
        "period": 4,
        "lect_length": 2,
        "type": "On-demand",
        "link2": "https://trpfrog.net",
        "id": "userid", // You can add id/pass
        "password": "password",
    },
]
