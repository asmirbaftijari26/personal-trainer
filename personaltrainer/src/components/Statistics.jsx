import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchTrainings } from "../../trainingapi";
import _ from "lodash";

function Statistics() {
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTrainings();
                const trainings = data._embedded.trainings;
                const groupedData = _(trainings)
                    .groupBy("activity")
                    .map((activityGroup, activity) => ({
                        activity,
                        duration: _.sumBy(activityGroup, "duration")
                    }))
                    .value();

                setActivityData(groupedData);
            } catch (error) {
                console.error("Error fetching training data:", error);
            }
        };

        loadData();
    }, []);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <h2>Minutes by Activity</h2>
            <ResponsiveContainer>
                <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activity" />
                    <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="duration" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Statistics;