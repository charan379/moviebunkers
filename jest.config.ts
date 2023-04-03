import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper({
    "@Applipcation": ["src/app.ts"],
    "@Config": ["src/config.ts"],
    "@controllers/*": ["src/app/controllers/*"],
    "@repositories/*": ["src/app/repositories/*"],
    "@models/*": ["src/app/models/*"],
    "@constants/*": ["src/app/constants/*"],
    "@middlewares/*": ["src/app/middlewares/*"],
    "@service/*": ["src/app/service/*"],
    "@utils/*": ["src/app/utils/*"],
    "@dto/*": ["src/app/dto/*"],
    "@exceptions/*": ["src/app/exceptions/*"],
    "@routes/*": ["src/app/routes/*"],
    "@joiSchemas/*": ["src/app/joiSchemas/*"],
    "@public/*": ["./public"],
  }),
  modulePaths: [
    '<rootDir>'
  ],
}