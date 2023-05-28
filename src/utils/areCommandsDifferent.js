module.exports = (existingCommand, localCommand) => {
  const areChoicesDifferent = (existingChoices = [], localChoices = []) => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices.find(
        (choice) => choice.name === localChoice.name
      )

      if (!existingChoice || localChoice.value !== existingChoice.value) {
        return true
      }
    }
    return false
  }

  const areOptionsDifferent = (existingOptions = [], localOptions = []) => {
    for (const localOption of localOptions) {
      // Add colon here
      const existingOption = existingOptions.find(
        (option) => option.name === localOption.name
      )

      if (!existingOption) {
        return true
      }

      const choicesDifferent = areChoicesDifferent(
        existingOption.choices,
        localOption.choices
      )

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== existingOption.required ||
        localOption.choices?.length !== existingOption.choices?.length ||
        choicesDifferent
      ) {
        return true
      }
    }
    return false
  }

  // Check if the existing and local commands are different
  if (
    existingCommand.description !== localCommand.description ||
    existingCommand.options?.length !== localCommand.options?.length ||
    areOptionsDifferent(existingCommand.options, localCommand.options)
  ) {
    return true
  }

  return false
}
