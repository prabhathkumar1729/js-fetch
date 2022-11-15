let userid = location.search.substring(1);
let selectedboxes = [];

function selectbox(postid) {
  if (selectedboxes.includes(postid)) {
    selectedboxes.splice(selectedboxes.indexOf(postid), 1);
  } else {
    selectedboxes.push(postid);
  }
}

function delpost(postid) {
  fetch("https://jsonplaceholder.typicode.com/posts/" + postid, {
    method: "DELETE",
  })
    .then((res) => res.status)
    .then((result) => {
      if (result == 200) {
        let elem = document.getElementById(postid);
        elem.remove();
        selectedboxes.splice(selectedboxes.indexOf(postid), 1);
        // location.reload();
      } else {
        alert("Error deleting post");
      }
    });
}

function multidel() {
  for (let postid of selectedboxes) {
    delpost(postid);
  }
  alert("Post(s) deleted successfully");
}

function conf(postid) {
  if (confirm("Are you sure you want to delete the post "+postid+"?")) {
    delpost(postid);
    alert("Post deleted successfully");
  } else {
    alert("Deletion cancelled");
  }
}

function multi_conf() {
  if (selectedboxes.length !== 0) {
    if (confirm("Are you sure you want to delete the selected post(s)?")) {
      multidel();
    } else {
      alert("Deletion cancelled");
    }
  } else {
    alert("You have not selected any post to delete");
  }
}

function editpost(postid) {
  postbody = document.getElementById("post" + postid + "-body");
  let cont = postbody.innerText;
  postbody.contentEditable = true;
  postbody.classList.add("input_focus");
  postbody.focus();
  postbody.onblur = () => {
    postbody.contentEditable = false;
    postbody.classList.remove("input_focus");
    if (cont !== postbody.innerText) {
      if (confirm("Do you want to save the changes?")) {
        fetch("https://jsonplaceholder.typicode.com/posts/" + postid, {
          method: "PUT",
          body: JSON.stringify({ body: postbody.innerText }),
        }).then((response) => {
          if (response.status === 200) {
            alert("Updated successfully!");
          } else {
            alert("Updated unsuccessfully");
            postbody.innerText = cont;
          }
        });
      } else {
        postbody.innerText = cont;
      }
    }
  };
}

fetch("https://jsonplaceholder.typicode.com/users/" + userid + "/posts")
  .then((res) => res.json())
  .then((data) => {
    data.forEach(async (itemData) => {
      let cmntres = await fetch(
        "https://jsonplaceholder.typicode.com/posts/" +
          itemData.id +
          "/comments"
      );
      let cmntdata = await cmntres.json();
      let temp = "";
      temp += "<div class='card' id=" + itemData.id + ">";
      temp +=
        "<div class='buttons'><input type='checkbox' value='" +
        itemData.id +
        "' onclick='selectbox(" +
        itemData.id +
        ")'><i class='fa-solid fa-pen-to-square' onclick='editpost(" +
        itemData.id +
        ")'></i><i class='fa-solid fa-trash-can' onclick='conf(" +
        itemData.id +
        ")'></i></div>";
      temp += "<div class='title'>" + itemData.title + "</div>";
      temp +=
        "<div class='body' id='post" +
        itemData.id +
        "-body'>" +
        itemData.body +
        "</div>";
      temp += "<div class='comments'>";
      let c_temp = "";
      let f = 1;
      for (let itemCmnt of cmntdata) {
        c_temp += "<div class='comment" + f + "'>";
        c_temp += "<div class='commenter'>" + itemCmnt.name + "</div>";
        c_temp += "<div class='comment'>" + itemCmnt.body + "</div>";
        c_temp += "<div class='commenteremail'>" + itemCmnt.email + "</div>";
        c_temp += "</div>";
        if (f === 3) {
          break;
        }
        f++;
      }
      temp += c_temp;
      temp += "</div></div>";
      document.getElementById("container").innerHTML += temp;
    });
  });
