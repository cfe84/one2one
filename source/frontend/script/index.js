

window.onload = () => {
  get("/principal", (error, principal) => {
    setElementsByName("username", principal.name)
  });
  reporteesController.load();
};
