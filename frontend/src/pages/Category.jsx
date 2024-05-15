import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { animated, useSpring } from "@react-spring/web";
import { styled, alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderRounded from "@mui/icons-material/FolderRounded";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import ClassIcon from "@mui/icons-material/Class";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { unstable_useTreeItem2 as useTreeItem2 } from "@mui/x-tree-view/useTreeItem2";
import {
  TreeItem2Content,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Root,
} from "@mui/x-tree-view/TreeItem2";
import { TreeItem2Icon } from "@mui/x-tree-view/TreeItem2Icon";
import { TreeItem2Provider } from "@mui/x-tree-view/TreeItem2Provider";
import Grid from "@mui/material/Grid";
import { useProduct } from "../context/product";
import CategoryIcon from "@mui/icons-material/Category";
import ClassOutlinedIcon from "@mui/icons-material/ClassOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import RadioButtonUncheckedOutlinedIcon from "@mui/icons-material/RadioButtonUncheckedOutlined";
import RadioButtonCheckedOutlinedIcon from "@mui/icons-material/RadioButtonCheckedOutlined";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function DotIcon() {
  return (
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "70%",
        bgcolor: "warning.main",
        display: "inline-block",
        verticalAlign: "middle",
        zIndex: 1,
        mx: 1,
      }}
    />
  );
}

const StyledTreeItemRoot = styled(TreeItem2Root)(({ theme }) => ({
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[400],
  position: "relative",
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: theme.spacing(3.5),
  },
}));

const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  flexDirection: "row-reverse",
  borderRadius: theme.spacing(0.7),
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1),
  fontWeight: 500,
  [`& .${treeItemClasses.iconContainer}`]: {
    marginRight: theme.spacing(2),
  },
  [`&.Mui-expanded `]: {
    "&:not(.Mui-focused, .Mui-selected, .Mui-selected.Mui-focused) .labelIcon":
      {
        color:
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.primary.dark,
      },
    "&::before": {
      content: '""',
      display: "block",
      position: "absolute",
      left: "16px",
      top: "44px",
      height: "calc(100% - 48px)",
      width: "1.5px",
      backgroundColor:
        theme.palette.mode === "light"
          ? theme.palette.grey[300]
          : theme.palette.grey[700],
    },
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color:
      theme.palette.mode === "light" ? theme.palette.primary.main : "white",
  },
  [`&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused`]: {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.main
        : theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
}));

const AnimatedCollapse = animated(Collapse);

function TransitionComponent(props) {
  const style = useSpring({
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(0,${props.in ? 0 : 20}px,0)`,
    },
  });

  return <AnimatedCollapse style={style} {...props} />;
}

const StyledTreeItemLabelText = styled(Typography)({
  color: "inherit",
  fontFamily: "Quicksand",
  fontWeight: 500,
});

function CustomLabel({ icon: Icon, expandable, children, onClick, ...other }) {
  const handleClick = () => {
    onClick(children); // Pass the value of the label to the onClick handler
  };

  return (
    <TreeItem2Label
      {...other}
      onClick={handleClick} // Attach the click handler to the label
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer", // Add pointer cursor to indicate clickable
      }}
    >
      {Icon && (
        <Box
          component={Icon}
          className="labelIcon"
          color="inherit"
          sx={{ mr: 1, fontSize: "1.2rem" }}
        />
      )}

      <StyledTreeItemLabelText variant="body2">
        {children}
      </StyledTreeItemLabelText>
      {expandable && <DotIcon />}
    </TreeItem2Label>
  );
}

const isExpandable = (reactChildren) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isExpandable);
  }
  return Boolean(reactChildren);
};

const getIconFromFileType = (fileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon;
    case "pdf":
      return PictureAsPdfIcon;
    case "doc":
      return ArticleIcon;
    case "video":
      return VideoCameraBackIcon;
    case "folder":
      return FolderRounded;
    case "pinned":
      return FolderOpenIcon;
    case "trash":
      return DeleteIcon;
    case "class":
      return ClassOutlinedIcon;
    case "category":
      return CategoryIcon;
    case "radio":
      return RadioButtonUncheckedOutlinedIcon;
    case "radioChecked":
      return RadioButtonCheckedOutlinedIcon;
    default:
      return ArticleIcon;
  }
};

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  const { id, itemId, label, disabled, children, onClick, ...other } = props;

  const {
    getRootProps,
    getContentProps,
    getIconContainerProps,
    getLabelProps,
    getGroupTransitionProps,
    status,
    publicAPI,
  } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

  const item = publicAPI.getItem(itemId);
  const expandable = isExpandable(children);
  let icon;
  if (expandable) {
    icon = ClassOutlinedIcon;
  } else if (item.fileType) {
    icon = getIconFromFileType(item.fileType);
  }

  return (
    <TreeItem2Provider itemId={itemId}>
      <StyledTreeItemRoot {...getRootProps(other)}>
        <CustomTreeItemContent
          {...getContentProps({
            className: clsx("content", {
              "Mui-expanded": status.expanded,
              "Mui-selected": status.selected,
              "Mui-focused": status.focused,
              "Mui-disabled": status.disabled,
            }),
          })}
        >
          <TreeItem2IconContainer {...getIconContainerProps()}>
            <TreeItem2Icon status={status} />
          </TreeItem2IconContainer>

          <CustomLabel
            {...getLabelProps({
              icon,
              expandable: expandable && status.expanded,
              onClick: onClick, // Pass the click handler
            })}
          />
        </CustomTreeItemContent>
        {children && <TransitionComponent {...getGroupTransitionProps()} />}
      </StyledTreeItemRoot>
    </TreeItem2Provider>
  );
});

export default function Category() {
  const { categories } = useProduct();
  const [selectedValue, setSelectedValue] = useState(null);
  const [products, setProducts] = useState([]);

  // Convert categories into the format required for the RichTreeView
  const transformedCategories = categories?.map((category) => ({
    id: category.category,
    label: category.category,
    fileType: category.sub_categories?.map === undefined ? "radio" : "class",
    children: category.sub_categories?.map((subCategory) => ({
      id: `${category.category}-${subCategory.sub_category}`,
      label: subCategory.sub_category,
      fileType:
        subCategory.sub_sub_category?.map === undefined ? "radio" : "class",
      children: subCategory.sub_sub_category?.map((subSubCategory) => ({
        id: `${category.category}-${subCategory.sub_category}-${subSubCategory}`,
        label: subSubCategory,
        fileType: "radio",
      })),
    })),
  }));

  // Function to handle click on tree item label
  const handleItemClick = async (value) => {
    setSelectedValue(value); // Update selected value

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${window.localStorage.getItem("token")}`,
    };
    try {
      const results = await axios.post(
        `http://localhost:8000/api/v1/category/filter-products?username=${window.localStorage.getItem(
          "username"
        )}&role=${window.localStorage.getItem("role")}`,
        { value },
        {
          headers,
        }
      );
      setProducts(results.data);
    } catch (err) {
      // LogOut();
      console.log("Error -> ", err);
    }
  };

  useEffect(() => {
    console.log(transformedCategories);
  }, []);

  return (
    <>
      <h1>Category</h1>
      <h1>Category</h1>
      <Grid container spacing={2}>
        <Grid item xs={3} style={{ backgroundColor: "ghostwhite" }}>
          <RichTreeView
            items={transformedCategories}
            aria-label="file explorer"
            defaultExpandedItems={["Baby & Kids", "Baby Care"]}
            defaultSelectedItems="Baby Safety Products"
            sx={{
              height: "fit-content",
              flexGrow: 1,
              maxWidth: 400,
              overflowY: "auto",
            }}
            slots={{
              item: (props) => (
                <CustomTreeItem {...props} onClick={handleItemClick} />
              ),
            }}
          />
        </Grid>
        <Grid container item xs={9}>
          <Grid container item xs={8}>
            <h1>Selected Value: {selectedValue}</h1>
          </Grid>
          <Grid container item xs={9}>
            {products.map((data, index) => (
              <Grid item xs={4.5} key={index} style={{ margin: "0 auto" }}>
                <ProductCard key={index} product={data} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
