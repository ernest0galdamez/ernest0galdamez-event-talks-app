const fs = require('fs');
const path = require('path');

const talks = JSON.parse(fs.readFileSync('talks.json', 'utf-8'));
const template = fs.readFileSync(path.join('src', 'template.html'), 'utf-8');
const style = fs.readFileSync(path.join('src', 'style.css'), 'utf-8');
const script = fs.readFileSync(path.join('src', 'script.js'), 'utf-8');

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function generateSchedule() {
    let scheduleHtml = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    talks.forEach((talk, index) => {
        if (index === 3) {
            // Add lunch break after the 3rd talk
            const breakStartTime = new Date(currentTime);
            const breakEndTime = new Date(breakStartTime.getTime() + 60 * 60 * 1000);
            scheduleHtml += `
                <div class="schedule-item break">
                    <div class="schedule-item-header">
                        <span class="schedule-item-time">${formatTime(breakStartTime)} - ${formatTime(breakEndTime)}</span>
                    </div>
                    <h2 class="schedule-item-title">Lunch Break</h2>
                </div>
            `;
            currentTime = breakEndTime;
        }

        const talkStartTime = new Date(currentTime);
        const talkEndTime = new Date(talkStartTime.getTime() + 60 * 60 * 1000); // Talks are 1 hour

        scheduleHtml += `
            <div class="schedule-item" data-categories="${talk.categories.join(', ')}">
                <div class="schedule-item-header">
                    <span class="schedule-item-time">${formatTime(talkStartTime)} - ${formatTime(talkEndTime)}</span>
                </div>
                <h2 class="schedule-item-title">${talk.title}</h2>
                <p class="schedule-item-speakers">By: ${talk.speakers.join(', ')}</p>
                <p>${talk.description}</p>
                <div class="schedule-item-categories">
                    ${talk.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
            </div>
        `;
        
        currentTime = talkEndTime;

        // Add transition break if it's not the last talk
        if (index < talks.length - 1 && index !== 2) { // also not before lunch
             currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000); // 10-minute break
        }
    });

    return scheduleHtml;
}


const schedule = generateSchedule();

let finalHtml = template.replace('{{SCHEDULE}}', schedule);
finalHtml = finalHtml.replace('{{CSS}}', style);
finalHtml = finalHtml.replace('{{JS}}', script);

if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

fs.writeFileSync(path.join('dist', 'index.html'), finalHtml);

console.log('Website successfully generated in dist/index.html');
