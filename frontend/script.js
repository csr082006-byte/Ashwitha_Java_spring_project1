const API_URL = "http://localhost:8080/api/students";

function setFeedback(message, isError = false) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.className = `feedback${isError ? " error" : ""}`;
}

function updateStudentCount(count) {
  const studentCount = document.getElementById("studentCount");
  if (studentCount) {
    studentCount.textContent = count;
  }
}

function loadStudents() {
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("studentTableBody");
      tableBody.innerHTML = "";
      updateStudentCount(data.length);

      if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No students yet. Add the first one above.</td></tr>';
        return;
      }

      data.forEach(student => {
        const row = `<tr>
                      <td>#${student.id}</td>
                      <td>${student.name}</td>
                      <td>${student.email}</td>
                      <td>${student.course}</td>
                   </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error("Error fetching students:", error);
      setFeedback("Unable to load students right now.", true);
    });
}

function addStudent() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const course = document.getElementById("course").value.trim();

  if (!name || !email || !course) {
    setFeedback("Please fill in all fields before adding a student.", true);
    return;
  }

  const student = { name, email, course };
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  })
    .then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Could not add student.");
      }
      return data;
    })
    .then(() => {
      setFeedback("Student added successfully!");
      loadStudents();
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("course").value = "";
    })
    .catch(error => {
      console.error("Error adding student:", error);
      setFeedback(error.message || "Something went wrong while adding the student.", true);
    });
}

loadStudents();