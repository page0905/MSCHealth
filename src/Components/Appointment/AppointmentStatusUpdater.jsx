import { useEffect } from "react";

const AppointmentStatusUpdater = () => {
  useEffect(() => {
    const updateAppointments = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/appointments`
        );
        const data = await res.json();
        const now = new Date();

        data.forEach(async (appt) => {
          let apptTime = null;

          if (appt.type === "instant") {
            if (!appt.timeSlot) {
              const timeSlot = new Date().toISOString();
              await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/appointments/${appt.id}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ timeSlot }),
                }
              );
              return;
            }
            apptTime = new Date(appt.timeSlot);
          } else if (appt.type === "normal") {
            if (appt.date && appt.selectedSlot) {
              const [startTimeStr] = appt.selectedSlot.split(" - ");
              const dateTimeStr = `${appt.date} ${startTimeStr}`;
              apptTime = new Date(dateTimeStr);
            }
          }

          if (
            apptTime &&
            now - apptTime > 30 * 60 * 1000 &&
            appt.status !== "completed"
          ) {
            await fetch(
              `${process.env.REACT_APP_API_BASE_URL}/appointments/${appt.id}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "completed" }),
              }
            );
          }
        });
      } catch (error) {
        console.error("Failed to update appointment statuses:", error);
      }
    };

    updateAppointments();
  }, []);

  return null;
};

export default AppointmentStatusUpdater;
