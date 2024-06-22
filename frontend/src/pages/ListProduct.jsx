import React, { useState, useEffect } from "react";
import {
  Grid,
  Breadcrumbs,
  IconButton,
  Tooltip,
  Zoom,
  Select,
  FormControl,
  MenuItem,
  Button,
  TextField,
  InputLabel,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/product";
import { useAuth } from "../context/auth";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LibraryAddRoundedIcon from "@mui/icons-material/LibraryAddRounded";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

export default function ListProduct() {
  const ImgUrl =
    "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg";

  const [selectedImg, setSelectedImg] = useState(ImgUrl);
  const [hoverImg, setHoverImg] = useState(null);

  const [justVerify, setJustVerify] = useState(false);

  const [productTitle, setProductTitle] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [imageInputs, setImageInputs] = useState([""]);
  const [descriptionInputs, setDescriptionInputs] = useState([
    { key: "", value: "" },
  ]);

  const { categories: categoriesData } = useProduct();
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subSubCategory, setSubSubCategory] = useState("");

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory(""); // Reset subCategory when category changes
    setSubSubCategory(""); // Reset subSubCategory when category changes
  };

  const handleSubCategoryChange = (e) => {
    setSubCategory(e.target.value);
    setSubSubCategory(""); // Reset subSubCategory when subCategory changes
  };

  const navigate = useNavigate();
  const { LogOut } = useAuth();

  const handleAddInput = () => {
    setImageInputs([...imageInputs, ""]);
  };

  const handleAddInputDescription = () => {
    setDescriptionInputs([...descriptionInputs, { key: "", value: "" }]);
  };

  const handleChange = (index, value) => {
    const newInputs = [...imageInputs];
    newInputs[index] = value;
    setImageInputs(newInputs);
  };

  const handleChangeDescriptionValue = (index, value) => {
    const newInputs = [...descriptionInputs];
    newInputs[index].value = value;
    setDescriptionInputs(newInputs);
  };

  const handleChangeDescriptionKey = (index, value) => {
    const newInputs = [...descriptionInputs];
    newInputs[index].key = value;
    setDescriptionInputs(newInputs);
  };

  const handleRemoveInput = (index) => {
    if (imageInputs.length > 1) {
      const newInputs = [...imageInputs];
      newInputs.splice(index, 1);
      setImageInputs(newInputs);
    }
  };

  const handleRemoveInputDescription = (index) => {
    if (descriptionInputs.length > 1) {
      const newInputs = [...descriptionInputs];
      newInputs.splice(index, 1);
      setDescriptionInputs(newInputs);
    }
  };

  const handlePhoneNumber = (e) => {
    const input = e.target.value.replace("+91 ", "");
    if (/^\d*$/.test(input) && input.length <= 10) {
      setPhoneNumber(input);
    }
  };

  const removeDuplicateImages = () => {
    const uniqueImages = Array.from(new Set(imageInputs));
    setImageInputs(uniqueImages);
  };

  const removeDuplicateDescriptions = () => {
    const uniqueDescriptions = descriptionInputs.reduce((acc, curr) => {
      if (
        !acc.some((item) => item.key === curr.key && item.value === curr.value)
      ) {
        acc.push(curr);
      }
      return acc;
    }, []);
    setDescriptionInputs(uniqueDescriptions);
  };

  const handleListProduct = async () => {
    removeDuplicateImages();
    removeDuplicateDescriptions();

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };

    try {
      const results = await axios.post(
        `http://localhost:8000/api/v1/product/list-product?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          product_title: productTitle,
          product_price: productPrice,
          product_available_quantity: productQuantity,
          product_seller_mobile_number: phoneNumber,
          product_image: imageInputs,
          product_description: descriptionInputs,
          product_category_name: category,
          product_sub_category_name: subCategory,
          product_sub_sub_category_name: subSubCategory,
        },
        { headers }
      );

      // Reset form fields
      setProductTitle("");
      setProductPrice("");
      setProductQuantity("");
      setPhoneNumber("");
      setImageInputs([""]);
      setDescriptionInputs([{ key: "", value: "" }]);

      setCategory("");
      setSubCategory("");
      setSubSubCategory("");

      // Display success toast
      toast.success("Product listed successfully!");
    } catch (err) {
      // LogOut();
      console.error("Error listing product:", err);
      toast.error("Error listing product. Please try again later.");
    }
  };

  const checkBankAccount = async () => {
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.get(
        `http://localhost:8000/api/v1/bank-details/account-exist?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        {
          headers,
        }
      );

      if (!results.data.isAccount) {
        toast("Please Create Account First!", {
          icon: "😊",
        });
        navigate("/dashboard");
      }
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    checkBankAccount();
  }, []);

  return (
    <>
      <Grid container margin={0} paddingY={2} paddingX={3}>
        <Grid
          xs={7}
          container
          margin={0}
          padding={0}
          sx={{ height: "70vh", width: "100%" }}
        >
          <Grid
            id="style-1"
            xs={2}
            margin={0}
            padding={0}
            sx={{
              overflow: "scroll",
              height: "100%",
              width: "100%",
            }}
          >
            {imageInputs.map((image, index) => (
              <Grid margin={0} paddingBottom={1} key={index}>
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  style={{
                    userSelect: "none",
                    backgroundColor: "#F2F2F2",
                    objectFit: "contain",
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: selectedImg === image ? "2px solid black" : "none",
                  }}
                  onError={(e) => {
                    e.target.src = ImgUrl;
                  }}
                  onClick={() => {
                    setSelectedImg(image);
                  }}
                  onMouseEnter={() => {
                    setHoverImg(image);
                  }}
                  onMouseLeave={() => {
                    setHoverImg(null);
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Grid
            xs={10}
            margin={0}
            paddingX={2}
            sx={{ height: "100%", width: "100%" }}
          >
            {selectedImg ? (
              <img
                onError={(e) => {
                  e.target.src = ImgUrl;
                }}
                src={hoverImg || selectedImg}
                alt={`Selected Img`}
                style={{
                  userSelect: "none",
                  backgroundColor: "#F2F2F2",
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
              />
            ) : (
              <img
                src={ImgUrl}
                alt={`Selected Img`}
                style={{
                  backgroundColor: "#F2F2F2",
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  cursor: "pointer",
                }}
              />
            )}
          </Grid>
        </Grid>
        <Grid
          xs={5}
          margin={0}
          padding={3}
          sx={{ backgroundColor: "lavender", borderRadius: "16px" }}
        >
          <Grid margin={0} padding={1}>
            <h1>List Product</h1>
          </Grid>
          <Grid margin={0} paddingX={1} paddingY={2}>
            <TextField
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
              id="title"
              label="Title"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={
                justVerify &&
                (productTitle === "" || productTitle.length >= 1024)
              }
              helperText={
                justVerify && productTitle === ""
                  ? "This field cannot be empty"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid margin={0} paddingX={1} paddingY={2}>
            <TextField
              value={productPrice}
              id="product-price"
              label="Product Price"
              placeholder="e.g. 100.58"
              variant="outlined"
              type="text"
              fullWidth
              required
              size="small"
              onChange={(e) => {
                const input = e.target.value;
                const regex = /^\d{0,8}(\.\d{0,2})?$/;
                if (regex.test(input)) {
                  setProductPrice(input);
                }
              }}
              error={
                justVerify && (productPrice === "" || productPrice.length > 10)
              }
              helperText={
                justVerify && productPrice === ""
                  ? "This field cannot be empty"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid margin={0} paddingX={1} paddingY={2}>
            <TextField
              value={productQuantity}
              id="product-quantity"
              label="Product Quantity"
              placeholder="e.g. 10"
              variant="outlined"
              fullWidth
              required
              size="small"
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d*$/.test(input)) {
                  setProductQuantity(input);
                }
              }}
              error={justVerify && productQuantity === ""}
              helperText={
                justVerify && productQuantity === ""
                  ? "This field cannot be empty"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
          <Grid margin={0} paddingX={1} paddingY={2}>
            <TextField
              value={`+91 ${phoneNumber}`}
              onChange={handlePhoneNumber}
              id="phone-number"
              label="Contact Number"
              placeholder="e.g. 1234567890"
              variant="outlined"
              fullWidth
              required
              size="small"
              error={
                justVerify && (phoneNumber === "" || phoneNumber.length !== 10)
              }
              helperText={
                justVerify && phoneNumber === ""
                  ? "This field cannot be empty."
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 25,
                  fontWeight: "bold",
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} margin={0} paddingY={2} paddingX={3}>
        <Grid
          xs={12}
          margin={0}
          padding={2}
          sx={{
            backgroundColor: "lavender",
            borderRadius: "16px",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid xs={12} margin={0} padding={2}>
            <h2>Select Category</h2>
          </Grid>
          <Grid
            xs={12}
            margin={0}
            padding={4}
            sx={{
              backgroundColor: "ghostwhite",
              borderRadius: "16px",
              width: "100%",
              height: "100%",
            }}
          >
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <FormControl size="small" fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  label="Category"
                  value={category}
                  onChange={handleCategoryChange}
                  sx={{
                    minWidth: "200px",
                    borderRadius: 25,
                    fontWeight: "bold",
                  }}
                >
                  <MenuItem value="">Select Category</MenuItem>
                  {categoriesData.map((categoryItem, index) => (
                    <MenuItem key={index} value={categoryItem.category}>
                      {categoryItem.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {category !== null &&
                category !== undefined &&
                category !== "" && (
                  <FormControl size="small" fullWidth>
                    <InputLabel id="sub-category-label">
                      Sub Category
                    </InputLabel>
                    <Select
                      labelId="sub-category-label"
                      id="sub-category"
                      label="Sub Category"
                      value={subCategory}
                      onChange={handleSubCategoryChange}
                      sx={{
                        minWidth: "200px",
                        borderRadius: 25,
                        fontWeight: "bold",
                      }}
                    >
                      {categoriesData
                        .find((item) => item.category === category)
                        ?.sub_categories.map((subCategoryItem, index) => (
                          <MenuItem
                            key={index}
                            value={subCategoryItem.sub_category}
                          >
                            {subCategoryItem.sub_category}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              {subCategory !== null &&
                subCategory !== undefined &&
                subCategory !== "" && (
                  <FormControl size="small" fullWidth>
                    <InputLabel id="sub-sub-category-label">
                      Sub Sub Category
                    </InputLabel>
                    <Select
                      labelId="sub-sub-category-label"
                      id="sub-sub-category"
                      label="Sub Sub Category"
                      value={subSubCategory}
                      onChange={(e) => setSubSubCategory(e.target.value)}
                      sx={{
                        minWidth: "200px",
                        borderRadius: 25,
                        fontWeight: "bold",
                      }}
                    >
                      {categoriesData
                        .find((item) => item.category === category)
                        ?.sub_categories.find(
                          (item) => item.sub_category === subCategory
                        )
                        ?.sub_sub_category.map((subSubItem, index) => (
                          <MenuItem key={index} value={subSubItem}>
                            {subSubItem}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} margin={0} paddingY={2} paddingX={3}>
        <Grid
          xs={12}
          margin={0}
          padding={2}
          sx={{
            backgroundColor: "lavender",
            borderRadius: "16px",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid xs={12} margin={0} padding={2}>
            <h2>Select Images</h2>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            xs={12}
            margin={0}
            padding={4}
            sx={{
              backgroundColor: "ghostwhite",
              borderRadius: "16px",
              width: "100%",
              height: "100%",
            }}
          >
            {imageInputs.map((input, index) => (
              <Grid
                container
                key={index}
                margin={0}
                padding={1}
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  xs={11}
                  margin={0}
                  padding={1}
                >
                  <TextField
                    value={input}
                    onChange={(e) => {
                      handleChange(index, e.target.value);
                      setSelectedImg(e.target.value);
                    }}
                    id={`image-${index + 1}`}
                    name={`image-${index + 1}`}
                    type="text"
                    placeholder={`Image ${index + 1}`}
                    label={`Image ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  xs={1}
                  margin={0}
                  padding={1}
                >
                  {imageInputs.length > 1 && (
                    <Tooltip
                      title="Remove"
                      TransitionComponent={Zoom}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "common.black",
                            "& .MuiTooltip-arrow": {
                              color: "common.black",
                            },
                          },
                        },
                      }}
                    >
                      <IconButton
                        aria-label="remove"
                        color="#ADD8E6"
                        onClick={() => handleRemoveInput(index)}
                        sx={{
                          backgroundColor: "lavender",
                          color: "#023E8A",
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            ))}
            <Grid margin={0} padding={0}>
              <Tooltip
                title="Add"
                TransitionComponent={Zoom}
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      "& .MuiTooltip-arrow": {
                        color: "common.black",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  aria-label="add"
                  color="#ADD8E6"
                  onClick={handleAddInput}
                  sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid xs={12} margin={0} paddingY={2} paddingX={3}>
        <Grid
          xs={12}
          margin={0}
          padding={2}
          sx={{
            backgroundColor: "lavender",
            borderRadius: "16px",
            width: "100%",
            height: "100%",
          }}
        >
          <Grid xs={12} margin={0} padding={2}>
            <h2>Add Description</h2>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            xs={12}
            margin={0}
            padding={4}
            sx={{
              backgroundColor: "ghostwhite",
              borderRadius: "16px",
              width: "100%",
              height: "100%",
            }}
          >
            {descriptionInputs.map((input, index) => (
              <Grid
                container
                key={index}
                margin={0}
                padding={1}
                alignItems="center"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  xs={3}
                  margin={0}
                  padding={1}
                >
                  <TextField
                    value={input.key}
                    onChange={(e) =>
                      handleChangeDescriptionKey(index, e.target.value)
                    }
                    id={`key-${index + 1}`}
                    name={`key-${index + 1}`}
                    type="text"
                    placeholder={`key ${index + 1}`}
                    label={`Key ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  xs={8}
                  margin={0}
                  padding={1}
                >
                  <TextField
                    value={input.value}
                    onChange={(e) =>
                      handleChangeDescriptionValue(index, e.target.value)
                    }
                    id={`value-${index + 1}`}
                    name={`value-${index + 1}`}
                    type="text"
                    placeholder={`value ${index + 1}`}
                    label={`Value ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 25,
                        fontWeight: "bold",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="center"
                  xs={1}
                  margin={0}
                  padding={1}
                >
                  {descriptionInputs.length > 1 && (
                    <Tooltip
                      title="Remove"
                      TransitionComponent={Zoom}
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            bgcolor: "common.black",
                            "& .MuiTooltip-arrow": {
                              color: "common.black",
                            },
                          },
                        },
                      }}
                    >
                      <IconButton
                        aria-label="remove"
                        color="#ADD8E6"
                        onClick={() => handleRemoveInputDescription(index)}
                        sx={{
                          backgroundColor: "lavender",
                          color: "#023E8A",
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            ))}
            <Grid margin={0} padding={0}>
              <Tooltip
                title="Add"
                TransitionComponent={Zoom}
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "common.black",
                      "& .MuiTooltip-arrow": {
                        color: "common.black",
                      },
                    },
                  },
                }}
              >
                <IconButton
                  aria-label="add"
                  color="#ADD8E6"
                  onClick={handleAddInputDescription}
                  sx={{ backgroundColor: "lavender", color: "#023E8A" }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        item
        padding={2}
        margin={0}
        justifyContent="center"
      >
        <Button
          variant="contained"
          onClick={handleListProduct}
          sx={{
            userSelect: "none",
            borderRadius: "16px",
            fontWeight: "bold",
            backgroundColor: "#03045e",
            "&:hover": {
              backgroundColor: "#032174",
            },
          }}
          startIcon={<LibraryAddRoundedIcon sx={{ color: "white" }} />}
          size="large"
        >
          List Product
        </Button>
      </Grid>
    </>
  );
}
