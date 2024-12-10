// scripts/modules/dateGreeting.js

function formatDate(date) {
    return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateDateAndGreeting() {
    const now = new Date();
    const hours = now.getHours();
    const greetingElement = document.getElementById('greeting');

    let greetingText = 'Hello';
    if (hours >= 5 && hours < 12) {
        greetingText = 'Gm';
    } else if (hours >= 12 && hours < 17) {
        greetingText = 'Good Afternoon';
    } else if (hours >= 17 && hours < 22) {
        greetingText = 'Good Evening';
    } else {
        greetingText = 'Good Night';
    }

    if (greetingElement) {
        greetingElement.textContent = `${greetingText}, ${window.ENV.USER_NAME || 'User'}`;
    }

    const dashboardDateElement = document.getElementById('dashboardDate');
    const formattedDate = formatDate(now);

    if (dashboardDateElement) {
        dashboardDateElement.textContent = formattedDate;
    }
}
