import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as RiIcons from 'react-icons/ri'
import { FaChartBar } from "react-icons/fa";

import { FaCloudUploadAlt } from "react-icons/fa";
import { LuLineChart } from "react-icons/lu";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GoReport } from "react-icons/go";

export const SidebarData = [

  {
    title:'Home',
    path: '/home/',
    disabled: true,
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title:'Data Manager',
        path: '/home/data-manager/',
        disabled: false,
        icon: <FaCloudUploadAlt />,
      },
      {
        title:'Data',
        path: '/home/data/',
        disabled: false,
        icon: <FaIcons.FaDatabase />,
      },
    ]
  },
  {
    title:'Charts',
    path: '/charts',
    disabled: true,
    icon: <FaChartBar />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title:'Multi Line Chart',
        path: '/charts/ml-chart',
        disabled: false,
        icon: <LuLineChart />,
      }
    ]
  },
  {
    title:'Help',
    path: '/help',
    disabled: true,
    icon: <IoIosHelpCircleOutline />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title:'Report Issue',
        path: '/help/report-issue',
        disabled: false,
        icon: <GoReport />,
      }
    ]
  }
]