import { z } from "zod";

const SizeSchema = z.enum(["auto", "stretch", "small", "medium", "large"]);
const TextSizeSchema = z.enum([
  "small",
  "default",
  "medium",
  "large",
  "extraLarge",
]);
const HorizontalAlignmentSchema = z.enum(["left", "center", "right"]);
const VerticalAlignmentSchema = z.enum(["top", "center", "bottom"]);
const SpacingSchema = z.enum([
  "none",
  "small",
  "default",
  "medium",
  "large",
  "extraLarge",
  "padding",
]);
const TextWeightSchema = z.enum(["lighter", "default", "bolder"]);
const TextColorSchema = z.enum([
  "default",
  "dark",
  "light",
  "accent",
  "good",
  "warning",
  "attention",
]);
const ContainerStyleSchema = z.enum(["default", "emphasis"]);
const ImageStyleSchema = z.enum(["default", "person"]);
const ActionStyleSchema = z.enum(["default", "positive", "destructive"]);

const IActionSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  style: ActionStyleSchema.optional(),
});

const ISubmitActionSchema = IActionSchema.extend({
  type: z.literal("Action.Submit"),
  data: z.any().optional(),
});

const IExecuteActionSchema = IActionSchema.extend({
  type: z.literal("Action.Execute"),
  data: z.any().optional(),
  verb: z.string().optional(),
});

const IOpenUrlActionSchema = z.object({
  ...IActionSchema.shape,
  type: z.literal("Action.OpenUrl"),
  url: z.string(),
});

// @ts-ignore
const IShowCardActionSchema = z.object({
  ...IActionSchema.shape,
  type: z.literal("Action.ShowCard"),
  // @ts-ignore
  card: z.lazy(() => IAdaptiveCardSchema),
});

const ICardElementSchema = z.object({
  id: z.string().optional(),
  speak: z.string().optional(),
  horizontalAlignment: HorizontalAlignmentSchema.optional(),
  spacing: SpacingSchema.optional(),
  separator: z.boolean().optional(),
  height: z.enum(["auto", "stretch"]).optional(),
  // Additional properties are allowed
  //@ts-ignore
  [z.string()]: z.any(),
});

const IBackgroundImageSchema = z.object({
  url: z.string(),
});

const ITextBlockSchema = ICardElementSchema.extend({
  type: z.literal("TextBlock"),
  size: TextSizeSchema.optional(),
  weight: TextWeightSchema.optional(),
  color: TextColorSchema.optional(),
  text: z.string(),
  isSubtle: z.boolean().optional(),
  wrap: z.boolean().optional(),
  maxLines: z.number().optional(),
});

const IContainerSchema = ICardElementSchema.extend({
  type: z.literal("Container"),
  backgroundImage: z.union([IBackgroundImageSchema, z.string()]).optional(),
  style: ContainerStyleSchema.optional(),
  verticalContentAlignment: VerticalAlignmentSchema.optional(),
  selectAction: IActionSchema.optional(),
  items: z.array(z.lazy(() => ICardElementSchema)).optional(),
});

const IColumnSchema = ICardElementSchema.extend({
  backgroundImage: z.union([IBackgroundImageSchema, z.string()]).optional(),
  style: ContainerStyleSchema.optional(),
  verticalContentAlignment: VerticalAlignmentSchema.optional(),
  selectAction: IActionSchema.optional(),
  items: z.array(z.lazy(() => ICardElementSchema)).optional(),
  width: z.union([z.number(), z.enum(["auto", "stretch"])]).optional(),
});

const IColumnSetSchema = ICardElementSchema.extend({
  type: z.literal("ColumnSet"),
  columns: z.array(IColumnSchema),
});

const IFactSchema = z.object({
  title: z.string(),
  value: z.string(),
  speak: z.string().optional(),
});

const ImageSetPresentationStyleSchema = z.enum(["Default", "Stacked", "Grid"]);

const IFactSetSchema = ICardElementSchema.extend({
  type: z.literal("FactSet"),
  facts: z.array(IFactSchema),
});

const IImageSchema = ICardElementSchema.extend({
  type: z.literal("Image"),
  altText: z.string().optional(),
  selectAction: IActionSchema.optional(),
  size: SizeSchema.optional(),
  style: ImageStyleSchema.optional(),
  url: z.string(),
});

const IImageSetSchema = ICardElementSchema.extend({
  type: z.literal("ImageSet"),
  images: z.array(IImageSchema),
  size: SizeSchema.optional(),
  style: ImageSetPresentationStyleSchema.optional(),
});

const IInputSchema = ICardElementSchema.extend({
  id: z.string(),
  value: z.string().optional(),
});

const IDateInputSchema = IInputSchema.extend({
  type: z.literal("Input.Date"),
  min: z.string().optional(),
  max: z.string().optional(),
  placeholder: z.string().optional(),
});

const ITimeInputSchema = IInputSchema.extend({
  type: z.literal("Input.Time"),
  min: z.string().optional(),
  max: z.string().optional(),
  placeholder: z.string().optional(),
});

const INumberInputSchema = IInputSchema.extend({
  type: z.literal("Input.Number"),
  min: z.number().optional(),
  max: z.number().optional(),
  placeholder: z.string().optional(),
});

const ITextInputSchema = IInputSchema.extend({
  type: z.literal("Input.Text"),
  isMultiline: z.boolean().optional(),
  maxLength: z.number().optional(),
  placeholder: z.string().optional(),
});

const IToggleInputSchema = IInputSchema.extend({
  type: z.literal("Input.Toggle"),
  title: z.string(),
  valueOn: z.string().optional(),
  valueOff: z.string().optional(),
});

const IChoiceSchema = z.object({
  title: z.string(),
  value: z.string(),
});

const IChoiceSetInputSchema = IInputSchema.extend({
  type: z.literal("Input.ChoiceSet"),
  isMultiSelect: z.boolean().optional(),
  style: z.enum(["expanded", "compact"]).optional(),
  placeholder: z.string().optional(),
  choices: z.array(IChoiceSchema),
});
//@ts-ignore
export const IAdaptiveCardSchema = ICardElementSchema.extend({
  type: z.literal("AdaptiveCard"),
  version: z.literal("1.3"),
  backgroundImage: z.union([IBackgroundImageSchema, z.string()]).optional(),
  body: z
    .array(
      z.union([
        ITextBlockSchema,
        IImageSchema,
        IImageSetSchema,
        IFactSetSchema,
        IColumnSetSchema,
        IContainerSchema,
      ])
    )
    .optional(),
  actions: z
    .array(
      z.union([
        ISubmitActionSchema,
        IOpenUrlActionSchema,
        IShowCardActionSchema,
        IExecuteActionSchema,
      ])
    )
    .optional(),
  speak: z.string().optional(),
});
