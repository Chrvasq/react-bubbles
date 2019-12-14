import React, { useState } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const initialErrors = {
  color: "",
  hex: ""
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [newColor, setNewColor] = useState(initialColor);
  const [errors, setErrors] = useState(initialErrors);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const setUpdatedColors = () => {
    axiosWithAuth()
      .get("/colors")
      .then(res => {
        updateColors(res.data);
      })
      .catch(err => console.log(err.message));
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
      .put(`colors/${colorToEdit.id}`, colorToEdit)
      .then(() => {
        setUpdatedColors();
      })
      .catch(err => console.log(err.message));
  };

  const deleteColor = color => {
    axiosWithAuth()
      .delete(`/colors/${color.id}`)
      .then(() => {
        setUpdatedColors();
      });
  };

  const addColor = e => {
    e.preventDefault();
    if (newColor.color !== "" && newColor.code.hex !== "") {
      axiosWithAuth()
        .post("/colors", newColor)
        .then(() => {
          setUpdatedColors();
          setNewColor(initialColor);
          setErrors(initialErrors);
        })
        .catch(err => {
          console.log(err.message);
        });
    } else if (newColor.color === "" && newColor.code.hex === "") {
      setErrors({
        color: "You need to enter a color",
        hex: "You need to enter a hex code"
      });
      console.log(errors);
    } else if (newColor.color === "") {
      setErrors({ color: "You need to enter a color" });
    } else if (newColor.code.hex === "") {
      setErrors({ hex: "You need to enter a hex code" });
    }
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span
                className="delete"
                onClick={e => {
                  e.stopPropagation();
                  deleteColor(color);
                }}
              >
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <form onSubmit={addColor}>
        <label>Color</label>
        <input
          value={newColor.color}
          onChange={e =>
            setNewColor({
              ...newColor,
              color: e.target.value
            })
          }
        />
        {errors.color && <p>{errors.color}</p>}
        <label>Hex Code</label>
        <input
          value={newColor.code.hex}
          onChange={e =>
            setNewColor({ ...newColor, code: { hex: e.target.value } })
          }
        />
        {errors.hex && <p>{errors.hex}</p>}
        <button>Add Color</button>
      </form>
      <div className="spacer" />
    </div>
  );
};

export default ColorList;
