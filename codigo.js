var fila = `
    <tr>
        <td class='id'></td>
        <td class='foto'></td>
        <td class='price'></td>
        <td class='title'></td>
        <td class='description'></td>
        <td class='category'></td>
        <td class='acciones'></td>
    </tr>`;
var productos=null;

  	function codigoCat(catstr) {
		var code="null";
		switch(catstr) {
			case "electronicos":code="c1";break;
	 		case "joyeria":code="c2";break;
			case "caballeros":code="c3";break;
			case "damas":code="c4";break;
		}
		return code;
	}   
	  
var orden=0;
	  
	  
function listarProductos(productos) {
    var precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden *= -1; listarProductos(productos);");
    var num = productos.length;
    var listado = document.getElementById("listado");
    var tbody = document.getElementById("tbody");

    tbody.innerHTML = ""; // Limpia el contenido de la tabla
    if (orden === 0) {
        orden = -1;
        precio.innerHTML = "Precio";
    } else if (orden === 1) {
        ordenarAsc(productos, "price");
        precio.innerHTML = "Precio A";
        precio.style.color = "darkgreen";
    } else if (orden === -1) {
        ordenarDesc(productos, "price");
        precio.innerHTML = "Precio D";
        precio.style.color = "blue";
    }

    listado.style.display = "block";

    productos.forEach((producto, index) => {
        var row = tbody.insertRow(); // Crea una fila nueva

        row.innerHTML = `
            <td class='id'>${producto.id}</td>
            <td class='foto'><img src='${producto.image}' onclick="window.open('${producto.image}')" style="cursor:pointer; max-width: 50px;"></td>
            <td class='price'>$${producto.price.toFixed(2)}</td>
            <td class='title'>${producto.title}</td>
            <td class='description'>${producto.description}</td>
            <td class='category'>${producto.category}</td>
            <td class='acciones'><button onclick="borrarProducto(${producto.id})">Borrar</button></td>
        `;

        // Asignar la clase al tr basado en la categoría
        row.className = codigoCat(producto.category);
    });
}

function obtenerProductos() {
	  fetch('https://api-generator.retool.com/aNvMTZ/data')
            .then(res=>res.json())
            .then(data=>{productos=data;
			productos.forEach(
				function(producto){
					producto.price=parseFloat(producto.price)
				});
			listarProductos(data)})
}

function ordenarDesc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return -1;
if(a[p_key] < b[p_key]) return 1;
return 0;
   });
}

function ordenarAsc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return 1;
if(a[p_key] < b[p_key]) return -1;
return 0;
   });
}

// Función para agregar un producto
function agregarProducto(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const titulo = document.getElementById("titulo").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const descripcion = document.getElementById("descripcion").value;
    const imagen = document.getElementById("imagen").value;
    const categoria = document.getElementById("categoria").value;

    // Validaciones adicionales
    if (!titulo || !descripcion || !imagen || !categoria || precio <= 0) {
        alert("Por favor, completa todos los campos correctamente.");
        return false;
    }

    // Crear el objeto del producto
    const nuevoProducto = {
        title: titulo,
        price: precio,
        description: descripcion,
        image: imagen,
        category: categoria
    };

    // Enviar el producto al servidor
    fetch("https://api-generator.retool.com/aNvMTZ/data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al agregar producto: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Producto agregado con éxito");
            console.log("Producto agregado:", data);
            obtenerProductos(); // Refresca la lista de productos
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Hubo un error al agregar el producto.");
        });

    // Limpiar el formulario
    document.getElementById("formAgregarProducto").reset();
}

function borrarProducto(id) {
    if (!confirm("¿Estás seguro de que deseas borrar este producto?")) {
        return;
    }

    fetch(`https://api-generator.retool.com/aNvMTZ/data/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al borrar producto: ${response.status}`);
        }
        alert("Producto borrado con éxito");
        obtenerProductos(); // Refresca la lista de productos
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un error al borrar el producto.");
    });
}