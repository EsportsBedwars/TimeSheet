document.addEventListener('DOMContentLoaded', function() {
    const addRowButton = document.getElementById('addRow');
    const workHoursTable = document.getElementById('workHoursTable').getElementsByTagName('tbody')[0];

    addRowButton.addEventListener('click', function() {
        const newRow = workHoursTable.insertRow();
        newRow.innerHTML = `
            <td><input type="date" name="date[]"></td>
            <td><input type="time" name="startTime[]"></td>
            <td><input type="time" name="endTime[]"></td>
            <td><input type="number" name="breakTime[]" step="0.1"></td>
            <td><input type="number" name="totalHours[]" step="0.1" readonly></td>
        `;
    });

    document.getElementById('timesheetForm').addEventListener('input', calculateHours);

    function calculateHours() {
        const rows = workHoursTable.getElementsByTagName('tr');
        let totalRegularHours = 0;

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('input');
            const startTime = cells[1].value;
            const endTime = cells[2].value;
            const breakTime = parseFloat(cells[3].value) || 0;

            if (startTime && endTime) {
                const start = new Date(`1970-01-01T${startTime}:00`);
                const end = new Date(`1970-01-01T${endTime}:00`);
                let workHours = (end - start) / (1000 * 60 * 60) - breakTime;
                cells[4].value = workHours.toFixed(1);
                totalRegularHours += workHours;
            }
        });

        // Removed total regular hours and overtime hours from the UI
    }

    document.getElementById('downloadCSV').addEventListener('click', function() {
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = ['Date', 'Start Time', 'End Time', 'Break Time (hours)', 'Total Hours'];
        csvContent += headers.join(",") + "\n";

        const rows = workHoursTable.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('input');
            const data = [];
            Array.from(cells).forEach(cell => data.push(cell.value));
            if (data.length > 0) csvContent += data.join(",") + "\n";
        });

        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'timesheet.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
