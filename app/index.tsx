import React, { useCallback } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue, useFrameCallback } from "react-native-reanimated";
import { Joystick } from "@/components/game/Joystick";
import { Character } from "@/components/game/Character";

const { width, height } = Dimensions.get("window");

export default function GameScreen() {
  // Character position
  const characterX = useSharedValue(width / 2);
  const characterY = useSharedValue(height / 2);

  // Joystick input values (normalised -1 to 1)
  const joystickX = useSharedValue(0);
  const joystickY = useSharedValue(0);

  // Movement speed (pixels per frame)
  const moveSpeed = 5;

  // Update character position every frame based on joystick input
  useFrameCallback(() => {
    if (joystickX.value !== 0 || joystickY.value !== 0) {
      const newX = characterX.value + joystickX.value * moveSpeed;
      const newY = characterY.value + joystickY.value * moveSpeed;

      // Keep character within screen bounds
      const characterSize = 50;
      const minX = characterSize / 2;
      const maxX = width - characterSize / 2;
      const minY = characterSize / 2;
      const maxY = height - characterSize / 2;

      characterX.value = Math.max(minX, Math.min(maxX, newX));
      characterY.value = Math.max(minY, Math.min(maxY, newY));
    }
  });

  const handleJoystickMove = useCallback(
    (x: number, y: number) => {
      // Store joystick input values
      joystickX.value = x;
      joystickY.value = y;
    },
    [joystickX, joystickY]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.gameArea}>
        <Character x={characterX} y={characterY} size={50} color="#FF5555" />
      </View>

      <View style={styles.controls}>
        <Joystick
          onMove={handleJoystickMove}
          size={150}
          stickSize={60}
          baseColor="rgba(100, 100, 100, 0.3)"
          stickColor="rgba(50, 50, 50, 0.7)"
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  gameArea: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 40,
  },
});
