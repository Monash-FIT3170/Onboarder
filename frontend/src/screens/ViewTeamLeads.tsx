import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  IconButton,
  Skeleton,
  TextField,
} from "@mui/material";
import BackIcon from "../assets/BackIcon"; // Replace with your actual icon import
import { useNavigate } from "react-router-dom";
import axios from "axios";