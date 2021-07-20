function settingsComponent(props) {
  return (
    <Page>
      <Section
        title={
          <Text bold align="center">
            Persona 5 Clock Face Settings
          </Text>
        }
      >
        <Select
          label={`Background`}
          settingsKey="background"
          options={[{ name: "Day" }, { name: "Night" }, { name: "Auto" }]}
        />

        <Select
          label={`Heart Icon Display`}
          settingsKey="heart_icon_display"
          options={[{ name: "Heart Rate" }]}
        />

      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);
