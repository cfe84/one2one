var reporteesController = {
  load: () => {
    loadComponent("main", "content", () => {
      get("/reportees/", (error, reportees) => {
          var reporteesElement = document.getElementById("reportees");
          reporteesElement.innerHTML = reportees.reduce((accumulator, reportee) =>
            accumulator + html(html.LIST_ELEMENT, reportee.name, { id: reportee.id }), "");
        }
      );
    });
  }
};