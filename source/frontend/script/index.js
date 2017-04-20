

window.onload = () => {
  get("/principal", (error, principal) => {
    setFieldsByName("username", principal.name)
  });
  loadComponent("main", "content");
};
