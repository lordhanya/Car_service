async function bookCar() {
    const car = document.getElementById('car').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    try {
        const response = await fetch('http://127.0.0.1:5000/api/bookCar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ car, fromDate, toDate }), // Check if the values are correct
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        alert(data.message); // Alert the success message
    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Error submitting booking: ' + error.message);
    }
}

async function fetchBookings() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/bookings');
        const bookings = await response.json();
        const bookingList = document.getElementById('booking-list');

        bookingList.innerHTML = ''; // Clear previous entries

        bookings.forEach(booking => {
            const li = document.createElement('li');
            li.innerHTML = `
                Car: ${booking.car}, From: ${booking.from_date}, To: ${booking.to_date}
                <button class="delete-btn" data-id="${booking.id}">Delete</button>
            `;
            bookingList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

async function deleteBooking(id) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/bookings/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Booking deleted successfully!');
            fetchBookings(); // Refresh the list after deletion
        } else {
            const errorData = await response.json();
            alert(`Error deleting booking: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}

// Use DOMContentLoaded to ensure the DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
    // Attach event listeners safely
    const seeBookingsBtn = document.querySelector(".see-bookings-btn");
    if (seeBookingsBtn) {
        seeBookingsBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default action
            fetchBookings(); // Call the function to fetch bookings
        });
    }

    const bookNowBtn = document.querySelector(".book-now-btn");
    if (bookNowBtn) {
        bookNowBtn.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default form submission
            bookCar(); // Call the booking function
        });
    };
    
    const bookingList = document.getElementById('booking-list');
    if (bookingList) {
        bookingList.addEventListener('click', async (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const bookingId = event.target.getAttribute('data-id');
                await deleteBooking(bookingId);
            }
        });
    }
}); 
