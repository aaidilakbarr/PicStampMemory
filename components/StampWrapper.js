import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Defs, Mask, Rect, Circle, G, Image as SvgImage } from 'react-native-svg';

export default function StampWrapper({ source, width = 280, height = 350, style }) {
  const [layout, setLayout] = useState({ width, height });

  const w = layout.width;
  const h = layout.height;

  // Configuration for stamp perforations
  const R = 6; // perforation radius
  const gap = 20; // gap between perforations

  // Calculate coordinates for top/bottom edge perforations
  const numHorizontal = Math.floor(w / gap);
  const horizontalOffset = (w - (numHorizontal - 1) * gap) / 2;
  const topBottomCircles = [];
  for (let i = 0; i < numHorizontal; i++) {
    const x = horizontalOffset + i * gap;
    topBottomCircles.push(<Circle key={`t-${i}`} cx={x} cy={0} r={R} fill="black" />);
    topBottomCircles.push(<Circle key={`b-${i}`} cx={x} cy={h} r={R} fill="black" />);
  }

  // Calculate coordinates for left/right edge perforations
  const numVertical = Math.floor(h / gap);
  const verticalOffset = (h - (numVertical - 1) * gap) / 2;
  const leftRightCircles = [];
  for (let i = 0; i < numVertical; i++) {
    const y = verticalOffset + i * gap;
    leftRightCircles.push(<Circle key={`l-${i}`} cx={0} cy={y} r={R} fill="black" />);
    leftRightCircles.push(<Circle key={`r-${i}`} cx={w} cy={y} r={R} fill="black" />);
  }

  // Corner circles to ensure clean stamp corners
  const corners = [
    <Circle key="c-tl" cx={0} cy={0} r={R} fill="black" />,
    <Circle key="c-tr" cx={w} cy={0} r={R} fill="black" />,
    <Circle key="c-bl" cx={0} cy={h} r={R} fill="black" />,
    <Circle key="c-br" cx={w} cy={h} r={R} fill="black" />,
  ];

  return (
    <View
      onLayout={(e) => {
        const { width: lw, height: lh } = e.nativeEvent.layout;
        if (lw > 0 && lh > 0) {
          setLayout({ width: lw, height: lh });
        }
      }}
      style={[styles.container, { width, height }, style]}
    >
      <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Mask to cut out the scalloped edges */}
          <Mask id="stampMask">
            {/* Base white rectangle: everything in white is kept */}
            <Rect x={0} y={0} width={w} height={h} fill="white" />
            {/* Black shapes: anything here is cut out */}
            {topBottomCircles}
            {leftRightCircles}
            {corners}
          </Mask>
        </Defs>

        {/* Vintage Stamp Shadow: render same masked shape with a solid dark translucent color, slightly offset */}
        <G translate={[0, 4]} opacity={0.08} mask="url(#stampMask)">
          <Rect x={0} y={0} width={w} height={h} fill="#1F1F1F" />
        </G>

        {/* main stamp base (the white paper container) */}
        <G mask="url(#stampMask)">
          {/* White stamp background paper */}
          <Rect x={0} y={0} width={w} height={h} fill="white" />

          {/* Inner image padding (e.g. 10px from edges) */}
          {source && (
            <SvgImage
              x={10}
              y={10}
              width={w - 20}
              height={h - 20}
              preserveAspectRatio="xMidYMid slice"
              href={typeof source === 'string' ? { uri: source } : source}
            />
          )}

          {/* Inner border to simulate old photo edge */}
          <Rect
            x={10}
            y={10}
            width={w - 20}
            height={h - 20}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
