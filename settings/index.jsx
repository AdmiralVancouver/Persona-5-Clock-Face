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
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);

/*
<Select
  label={`Time Format`}
  settingsKey="time_format"
  options={[
    {name:"12h"},
    {name:"24h"},
  ]}
/>
*/
