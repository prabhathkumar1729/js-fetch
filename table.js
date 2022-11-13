function rowclick(id) {
  location.href = "user.html?" + id;
}
fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    if (data.length > 0) {
      var temp = "";
      data.forEach((itemData) => {
        temp += "<tr onclick='rowclick(" + itemData.id + ")'>";
        temp += "<td>" + itemData.name + "</td>";
        temp += "<td>" + itemData.email + "</td>";
        temp += "<td>" + itemData.phone + "</td>";
        temp += "<td>" + itemData.website + "</td>";
        temp += "<td>" + itemData.company.name + "</td></tr>";
      });
      document.getElementById("data").innerHTML = temp;
    }
  });
