import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, CardContent, Typography } from '@mui/material';
import { fetchTrainings } from '../../trainingapi';

function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const loadTrainings = async () => {
            try {
                const data = await fetchTrainings();
                const trainings = data._embedded.trainings;
                const events = await Promise.all(
                    trainings.map(async (training) => {
                        const customerResponse = await fetch(training._links.customer.href);
                        const customerData = await customerResponse.json();
                        const customerName = `${customerData.firstname} ${customerData.lastname}`;

                        return {
                            title: `${training.activity} / ${customerName}`,
                            start: training.date,
                            end: new Date(new Date(training.date).getTime() + training.duration * 60000).toISOString(),
                        };
                    })
                );
                setEvents(events);

            } catch (error) {
                console.error('Error fetching trainings:', error);
            }
        };
        loadTrainings();
    }, []);

    return (
        <Card variant="outlined">
            <CardContent>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    events={events}
                />
            </CardContent>
        </Card>
    );
};

export default Calendar;
