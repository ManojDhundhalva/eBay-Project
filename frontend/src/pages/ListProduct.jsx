import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { toast } from "react-hot-toast";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormLabel from "@mui/material/FormLabel";
import { Carousel } from "react-bootstrap";
import getLPTheme from "../getLPTheme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useProduct } from "../context/product";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export default function ListProduct() {
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

  const LPtheme = createTheme(getLPTheme());
  const navigate = useNavigate();

  const { isAddedBankAccount } = useProduct();
  const { LogOut } = useAuth();

  const ImgUrl =
    "https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg";

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
    const input = e.target.value;
    if (/^\d*$/.test(input)) {
      if (input.length <= 10) {
        setPhoneNumber(input);
      }
    }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imageInputs.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [imageInputs.length]);

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

      // Display success toast
      toast.success("Product listed successfully!");
    } catch (err) {
      // LogOut();
      console.error("Error listing product:", err);
      toast.error("Error listing product. Please try again later.");
    }
  };

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (!isAddedBankAccount) {
        toast("Please Create Account First!", {
          icon: "😊",
        });
        navigate("/account");
      }
    }
  }, [isAddedBankAccount]);

  return (
    <>
      <ThemeProvider theme={LPtheme}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            {imageInputs.length === 1 && imageInputs[0] === "" ? (
              <>
                <Carousel>
                  <Carousel.Item>
                    <img
                      src={ImgUrl}
                      alt={ImgUrl}
                      onError={(e) => {
                        e.target.src = ImgUrl;
                      }}
                    />
                    <Carousel.Caption>
                      <h3>Demo Img</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                </Carousel>
              </>
            ) : (
              <Carousel activeIndex={index} onSelect={() => {}}>
                {imageInputs.map((image, idx) => (
                  <Carousel.Item key={idx}>
                    <img
                      width="100%"
                      src={image}
                      alt={`Slide ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = ImgUrl; // Set source to placeholder image
                        e.target.onerror = null; // Remove the onError event to avoid infinite loop
                        const caption =
                          e.target.parentElement.querySelector(
                            ".carousel-caption"
                          );
                        if (caption) {
                          const heading = document.createElement("h3");
                          heading.textContent = "Image not found";
                          caption.innerHTML = "";
                          caption.appendChild(heading);
                        }
                      }}
                    />
                    <Carousel.Caption>
                      <h3>Image {idx + 1}</h3>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <Grid
              spacing={2}
              direction="column"
              // justifyContent="center"
              // alignItems="center"
            >
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                List Product
              </Typography>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="product-title" required>
                  Title
                </FormLabel>
                <TextField
                  value={productTitle}
                  id="product-title"
                  name="product-title"
                  type="text"
                  placeholder="product title"
                  autoComplete="off"
                  onChange={(e) => setProductTitle(e.target.value)}
                  required
                  error={productTitle === "" || productTitle.length >= 1024}
                  helperText={
                    productTitle === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="product-price">Product Price</FormLabel>
                <TextField
                  value={productPrice}
                  id="product-price"
                  name="product-price"
                  type="number"
                  placeholder="product price"
                  autoComplete="off"
                  variant="outlined"
                  onChange={(e) => {
                    const inputPrice = parseFloat(e.target.value);
                    if (!isNaN(inputPrice) && inputPrice >= 0) {
                      setProductPrice(inputPrice);
                    }
                  }}
                  required
                  error={productPrice === ""}
                  helperText={
                    productPrice === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="product-quantity">
                  Product Quantity
                </FormLabel>
                <TextField
                  value={productQuantity}
                  id="product-quantity"
                  name="product-quantity"
                  type="number"
                  placeholder="product quantity"
                  autoComplete="off"
                  variant="outlined"
                  onChange={(e) => {
                    const inputQuantity = parseFloat(e.target.value);
                    if (!isNaN(inputQuantity) && inputQuantity >= 0) {
                      setProductQuantity(inputQuantity);
                    }
                  }}
                  required
                  error={productQuantity === ""}
                  helperText={
                    productQuantity === "" ? "This field cannot be empty" : ""
                  }
                />
              </FormGrid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} className="mt-3">
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <FormLabel htmlFor="category" required>
                      Category
                    </FormLabel>
                    <Select
                      value={category}
                      onChange={handleCategoryChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {categoriesData.map((categoryItem, index) => (
                        <MenuItem key={index} value={categoryItem.category}>
                          {categoryItem.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {category && (
                  <Grid item xs={12} md={6} className="mt-3">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <FormLabel htmlFor="sub-category" required>
                        Sub Category
                      </FormLabel>
                      <Select
                        value={subCategory}
                        onChange={handleSubCategoryChange}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="">Select Sub Category</MenuItem>
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
                  </Grid>
                )}
                {subCategory && (
                  <Grid item xs={12} md={6} className="mt-3">
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <FormLabel htmlFor="sub-sub-category" required>
                        Sub Sub Category
                      </FormLabel>
                      <Select
                        value={subSubCategory}
                        onChange={(e) => setSubSubCategory(e.target.value)}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                      >
                        <MenuItem value="">Select Sub Sub Category</MenuItem>
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
                  </Grid>
                )}
              </Grid>
              <FormGrid item xs={12} md={6} className="mt-3">
                <FormLabel htmlFor="phoneNumber" required>
                  Seller Phone Number
                </FormLabel>
                <TextField
                  className="mt-1"
                  id="standard-basic-2"
                  required
                  fullWidth
                  name="phoneNumber"
                  autoFocus
                  onChange={handlePhoneNumber}
                  value={phoneNumber}
                  InputProps={{
                    style: {
                      fontFamily: "Quicksand",
                      fontWeight: "bold",
                    },
                  }}
                  error={phoneNumber === "" || phoneNumber.length !== 10}
                  helperText={
                    phoneNumber === ""
                      ? "This field cannot be empty."
                      : phoneNumber.length !== 10
                      ? "Phone number must be exactly 10 digits."
                      : ""
                  }
                  autoComplete="off"
                />
              </FormGrid>

              {imageInputs.map((input, index) => (
                <Box key={index}>
                  <FormGrid item xs={12} md={6}>
                    <FormLabel htmlFor={`image-${index + 1}`}>
                      {`Image ${index + 1}`}
                    </FormLabel>
                    <TextField
                      value={input}
                      id={`image-${index + 1}`}
                      name={`image-${index + 1}`}
                      type="text"
                      placeholder={`Image ${index + 1}`}
                      autoComplete="off"
                      variant="outlined"
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </FormGrid>
                  {imageInputs.length > 1 && (
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveInput(index)}
                    >
                      <RemoveIcon />
                    </Button>
                  )}
                </Box>
              ))}
              <Button variant="contained" onClick={handleAddInput}>
                <AddIcon />
              </Button>
              {descriptionInputs.map((input, index) => (
                <Box key={index}>
                  <FormGrid item xs={12} md={6}>
                    <FormLabel htmlFor={`key-${index + 1}`}>
                      {`Key ${index + 1}`}
                    </FormLabel>
                    <TextField
                      value={input.key}
                      id={`key-${index + 1}`}
                      name={`key-${index + 1}`}
                      type="text"
                      placeholder={`key ${index + 1}`}
                      autoComplete="off"
                      variant="outlined"
                      onChange={(e) =>
                        handleChangeDescriptionKey(index, e.target.value)
                      }
                    />
                  </FormGrid>
                  <FormGrid item xs={12} md={6}>
                    <FormLabel htmlFor={`value-${index + 1}`}>
                      {`Value ${index + 1}`}
                    </FormLabel>
                    <TextField
                      value={input.value}
                      id={`value-${index + 1}`}
                      name={`value-${index + 1}`}
                      type="text"
                      placeholder={`value ${index + 1}`}
                      autoComplete="off"
                      variant="outlined"
                      onChange={(e) =>
                        handleChangeDescriptionValue(index, e.target.value)
                      }
                    />
                  </FormGrid>
                  {descriptionInputs.length > 1 && ( // Render remove button conditionally
                    <Button
                      variant="contained"
                      onClick={() => handleRemoveInputDescription(index)}
                    >
                      <RemoveIcon />
                    </Button>
                  )}
                </Box>
              ))}
              <Button variant="contained" onClick={handleAddInputDescription}>
                <AddIcon />
              </Button>
              <Button variant="contained" onClick={handleListProduct}>
                List Product
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
      <div className="mb-4">ListProduct</div>
    </>
  );
}
