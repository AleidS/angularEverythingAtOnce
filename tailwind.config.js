import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{html,ts,css}', // <-- Add this line for Angular
    ],
    future: {
        // hoverOnlyWhenSupported: true,
    },
  // ...
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // https://tailcolor.com/ to easily get color palette!
            // https://www.tints.dev/purple/D08152 to generate
            colors: {
                "primary": {
                    50: "#F1FBFE",
                    100: "#E0F7FF",
                    200: "#AFE6F8",
                    300: "#87D4EE",
                    400: "#64BFDD",
                    500: "#46A4C3",
                    600: "#437F93",
                    700: "#3E5860",
                    800: "#333738",
                    900: "#1A1A1A",
                    950: "#0D0D0D"
                },
                'secondary':{
                    50: "#E9F1F1",
                    100: "#D4E3E2",
                    200: "#A9C7C6",
                    300: "#7AA8A7",
                    400: "#578583",
                    500: "#3A5958",
                    600: "#2E4746",
                    700: "#223434",
                    800: "#182525",
                    900: "#0C1312",
                    950: "#060909"
                },
                'success':{
                      50: "#EAF5EB",
                    100: "#D5ECD6",
                    200: "#AEDAB1",
                    300: "#84C788",
                    400: "#5EB662",
                    500: "#439347",
                    600: "#316D34",
                    700: "#1F4421",
                    800: "#152E16",
                    900: "#0A150A",
                    950: "#050B05"
                },
                'danger':{
                   50: "#F9E9E7",
                    100: "#F4D7D2",
                    200: "#E7ACA2",
                    300: "#DC8475",
                    400: "#CF5944",
                    500: "#AF402D",
                    600: "#823021",
                    700: "#521E15",
                    800: "#35130E",
                    900: "#1C0A07",
                    950: "#0C0403"
                },
                'secondaryOld':{
                    "50": "#ecf4f3",
                    "100": "#d9e8e7",
                    "200": "#b3d1d0",
                    "300": "#8cbab8",
                    "400": "#66a3a1",
                    "500": "#408c89",
                    "600": "#33706e",
                    "700": "#265452",
                    "800": "#1a3837",
                    "900": "#0d1c1b"    
                },
                 'uiGray':{
                    50: "#F0F0EF",
                    100: "#E2E0DF",
                    200: "#C7C4C1",
                    300: "#AAA5A1",
                    400: "#908884",
                    500: "#716A66",
                    600: "#534E4B",
                    700: "#33302E",
                    800: "#23211F",
                    900: "#100F0F",
                    950: "#080807"
                    },
                'uiDark':{
                   50: "#D2B8A7",
                    100: "#C3A998",
                    200: "#A78A77",
                    300: "#7F6A5C",
                    400: "#594D45",
                    500: "#33302E",
                    600: "#2B2522",
                    700: "#211B18",
                    800: "#191410",
                    900: "#0D0A08",
                    950: "#070503"
                },
                'uiGray2':{
                    50: "#F3F2F2",
                    100: "#E7E5E4",
                    200: "#CFCBC9",
                    300: "#B6B2AF",
                    400: "#9E9894",
                    500: "#837C76",
                    600: "#69625E",
                    700: "#4E4946",
                    800: "#33302E",
                    900: "#1B1918",
                    950: "#0D0D0C"
            }

                
        }
        },
         
    },

    plugins: [],
};
