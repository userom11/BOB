import Svg, { Circle, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import React , { useState, useEffect } from 'react';

export function Medisymbol(props) {
const focal_point_color = "#6660ff";
const [outer_sides_color, setOuterColor] = useState("#6699af");

const colors = []; // flicker shades
for(let n=0; n<90; n++){
	let s = 50 + (n*(30/90))
	let l = 40 + (n*(20/90))
	colors.push(`hsl(200, ${s}%, ${l}%)`)
}

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % colors.length;
      setOuterColor(colors[index]);
    }, 16); // 0.1 sec

    return () => clearInterval(interval);
  }, []);



  return (
		<Svg width="85%" height="46%" viewBox="0 0 100 100" {... props}>
		  <Defs>
    		<LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
      				<Stop offset="0%" stopColor={focal_point_color} stopOpacity="1" />
      				<Stop offset="100%" stopColor={outer_sides_color} stopOpacity="1" />
    			</LinearGradient>
    		<LinearGradient id="gradr" x1="0" y1="0" x2="1" y2="1">
      				<Stop offset="100%" stopColor={focal_point_color} stopOpacity="1" />
      				<Stop offset="0%" stopColor={outer_sides_color} stopOpacity="1" />
    			</LinearGradient>
  			</Defs>
      		<Circle cx="50" cy="50" r="45" fill="#00000000" stroke={outer_sides_color} />
      		<Rect x="09" y="45" width="41" height="10" rx="3" fill="url(#grad)" />
      		<Rect x="50" y="45" width="41" height="10" rx="3" fill="url(#gradr)" />

      		<Rect x="45" y="09" width="10" height="41" ry="3" fill="url(#grad)" />
      		<Rect x="45" y="50" width="10" height="41" ry="3" fill="url(#gradr)" />
    	</Svg>
  );
}
