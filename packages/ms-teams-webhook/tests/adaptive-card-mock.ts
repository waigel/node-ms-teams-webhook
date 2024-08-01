import type { AdaptiveCard } from "../src/adaptive-card";

export const AdaptiveCardMock = {
  templatePayload: {
    type: "AdaptiveCard",
    body: [
      {
        type: "TextBlock",
        size: "medium",
        weight: "bolder",
        dfsdf: "sdf",
        text: "${title}",
      },
      {
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            items: [
              {
                type: "Image",
                style: "person",
                url: "${creator.profileImage}",
                altText: "${creator.name}",
                size: "small",
              },
            ],
            width: "auto",
          },
          {
            type: "Column",
            items: [
              {
                type: "TextBlock",
                weight: "bolder",
                text: "${creator.name}",
                wrap: true,
              },
              {
                type: "TextBlock",
                spacing: "none",
                text: "Created {{DATE(${createdUtc},SHORT)}}",
                isSubtle: true,
                wrap: true,
              },
            ],
            width: "stretch",
          },
        ],
      },
      {
        type: "TextBlock",
        text: "${description}",
        wrap: true,
      },
      {
        type: "FactSet",
        facts: [
          {
            title: "${key}:",
            value: "${value}",
          },
        ],
      },
    ],
    actions: [
      {
        type: "Action.ShowCard",
        title: "Set due date",
        card: {
          type: "AdaptiveCard",
          body: [
            {
              type: "Input.Date",
              id: "dueDate",
            },
            {
              type: "Input.Text",
              id: "comment",
              placeholder: "Add a comment",
              isMultiline: true,
            },
          ],
          actions: [
            {
              type: "Action.Submit",
              title: "OfK",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        },
      },
      {
        type: "Action.OpenUrl",
        title: "View",
        url: "${viewUrl}",
      },
    ],
    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
    version: "1.4",
  } satisfies AdaptiveCard,
  templateDataPayload: {
    title: "Publish Adaptive Card Schema",
    description:
      "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",
    creator: {
      name: "Matt Hidinger",
      profileImage:
        "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
    },
    createdUtc: "2017-02-14T06:08:39Z",
    viewUrl: "https://adaptivecards.io",
    properties: [
      {
        key: "Board",
        value: "Adaptive Cards",
      },
      {
        key: "List",
        value: "Backlog",
      },
      {
        key: "Assigned to",
        value: "Matt Hidinger",
      },
      {
        key: "Due date",
        value: "Not set",
      },
    ],
  },
  mergedPayload: {
    type: "message",
    summary: "Adaptive Card",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              size: "medium",
              weight: "bolder",
              dfsdf: "sdf",
              text: "Publish Adaptive Card Schema",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  items: [
                    {
                      type: "Image",
                      style: "person",
                      url: "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
                      altText: "Matt Hidinger",
                      size: "small",
                    },
                  ],
                  width: "auto",
                },
                {
                  type: "Column",
                  items: [
                    {
                      type: "TextBlock",
                      weight: "bolder",
                      text: "Matt Hidinger",
                      wrap: true,
                    },
                    {
                      type: "TextBlock",
                      spacing: "none",
                      text: "Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}",
                      isSubtle: true,
                      wrap: true,
                    },
                  ],
                  width: "stretch",
                },
              ],
            },
            {
              type: "TextBlock",
              text: "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",
              wrap: true,
            },
            {
              type: "FactSet",
              facts: [{ title: "${key}:", value: "${value}" }],
            },
          ],
          actions: [
            {
              type: "Action.ShowCard",
              title: "Set due date",
              card: {
                type: "AdaptiveCard",
                body: [
                  { type: "Input.Date", id: "dueDate" },
                  {
                    type: "Input.Text",
                    id: "comment",
                    placeholder: "Add a comment",
                    isMultiline: true,
                  },
                ],
                actions: [{ type: "Action.Submit", title: "OfK" }],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              },
            },
            {
              type: "Action.OpenUrl",
              title: "View",
              url: "https://adaptivecards.io",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.4",
        },
      },
    ],
  },

  mergedPayloadsOfTwoCards: {
    type: "message",
    summary: "Adaptive Card",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              size: "medium",
              weight: "bolder",
              dfsdf: "sdf",
              text: "Publish Adaptive Card Schema",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  items: [
                    {
                      type: "Image",
                      style: "person",
                      url: "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
                      altText: "Matt Hidinger",
                      size: "small",
                    },
                  ],
                  width: "auto",
                },
                {
                  type: "Column",
                  items: [
                    {
                      type: "TextBlock",
                      weight: "bolder",
                      text: "Matt Hidinger",
                      wrap: true,
                    },
                    {
                      type: "TextBlock",
                      spacing: "none",
                      text: "Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}",
                      isSubtle: true,
                      wrap: true,
                    },
                  ],
                  width: "stretch",
                },
              ],
            },
            {
              type: "TextBlock",
              text: "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",
              wrap: true,
            },
            {
              type: "FactSet",
              facts: [{ title: "${key}:", value: "${value}" }],
            },
          ],
          actions: [
            {
              type: "Action.ShowCard",
              title: "Set due date",
              card: {
                type: "AdaptiveCard",
                body: [
                  { type: "Input.Date", id: "dueDate" },
                  {
                    type: "Input.Text",
                    id: "comment",
                    placeholder: "Add a comment",
                    isMultiline: true,
                  },
                ],
                actions: [{ type: "Action.Submit", title: "OfK" }],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              },
            },
            {
              type: "Action.OpenUrl",
              title: "View",
              url: "https://adaptivecards.io",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.4",
        },
      },
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          type: "AdaptiveCard",
          body: [
            {
              type: "TextBlock",
              size: "medium",
              weight: "bolder",
              dfsdf: "sdf",
              text: "Title 2",
            },
            {
              type: "ColumnSet",
              columns: [
                {
                  type: "Column",
                  items: [
                    {
                      type: "Image",
                      style: "person",
                      url: "https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg",
                      altText: "Matt Hidinger",
                      size: "small",
                    },
                  ],
                  width: "auto",
                },
                {
                  type: "Column",
                  items: [
                    {
                      type: "TextBlock",
                      weight: "bolder",
                      text: "Matt Hidinger",
                      wrap: true,
                    },
                    {
                      type: "TextBlock",
                      spacing: "none",
                      text: "Created {{DATE(2017-02-14T06:08:39Z,SHORT)}}",
                      isSubtle: true,
                      wrap: true,
                    },
                  ],
                  width: "stretch",
                },
              ],
            },
            {
              type: "TextBlock",
              text: "Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.",
              wrap: true,
            },
            {
              type: "FactSet",
              facts: [{ title: "${key}:", value: "${value}" }],
            },
          ],
          actions: [
            {
              type: "Action.ShowCard",
              title: "Set due date",
              card: {
                type: "AdaptiveCard",
                body: [
                  { type: "Input.Date", id: "dueDate" },
                  {
                    type: "Input.Text",
                    id: "comment",
                    placeholder: "Add a comment",
                    isMultiline: true,
                  },
                ],
                actions: [{ type: "Action.Submit", title: "OfK" }],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              },
            },
            {
              type: "Action.OpenUrl",
              title: "View",
              url: "https://adaptivecards.io",
            },
          ],
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          version: "1.4",
        },
      },
    ],
  },
};
