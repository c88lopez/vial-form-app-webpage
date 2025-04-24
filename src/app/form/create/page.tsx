"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { IFormField } from "@/app/form/types";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  const [name, setName] = useState<string>("");
  const [fields, setFields] = useState<Record<string, IFormField>>({});

  function handleFormNameChange(newName: string) {
    setName(newName);
  }

  function handleNewInput(type: string) {
    const nextFieldIndex = Object.keys(fields).length + 1;

    const newFields: Record<string, IFormField> = {
      ...fields,
    };

    newFields[`field-${nextFieldIndex}`] = {
      type,
      question: "",
      required: false,
    };

    setFields(newFields);
  }

  function handleInputQuestionChange(fieldIndex: string, newQuestion: string) {
    const newFields = fields;

    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      question: newQuestion,
    };

    setFields(newFields);
  }

  function handleInputRequiredChange(fieldIndex: string) {
    const newFields = fields;

    newFields[fieldIndex] = {
      ...newFields[fieldIndex],
      required: !newFields[fieldIndex].required,
    };

    setFields(newFields);
  }

  function handleRemoveField(fieldIndexToRemove: string) {
    setFields(
      Object.keys(fields).reduce(
        (newFields: Record<string, IFormField>, fieldIndex: string) => {
          if (fieldIndex === fieldIndexToRemove) {
            return newFields;
          }

          newFields[fieldIndex] = fields[fieldIndex];

          return newFields;
        },
        {},
      ),
    );
  }

  function onSubmit() {
    fetch(`${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        fields,
      }),
    }).then((response) => {
      if (response.status === 200) {
        toast.success("Form Created");
        redirect("/form");
      }

      response.json().then((json) => {
        console.error(new Error(json.message));
        toast.error("Error creating form");
      });
    });
  }

  return (
    <div className="p-3">
      <h1 className="bold text-2xl">New Form</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
          <Label htmlFor="name">Name</Label>
          <Input
            type="name"
            id="name"
            onChange={(e) => handleFormNameChange(e.target.value)}
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
          <Label htmlFor="name">Fields</Label>

          {Object.keys(fields).map((fieldIndex) => {
            return (
              <div
                className="grid w-full max-w-sm items-center gap-1.5 py-3"
                key={fieldIndex}
              >
                <p>Type: {fields[fieldIndex].type}</p>
                Question:{" "}
                <Input
                  type="text"
                  onChange={(event) =>
                    handleInputQuestionChange(fieldIndex, event.target.value)
                  }
                />
                {fields[fieldIndex].type !== "checkbox" && (
                  <p>
                    Required:{" "}
                    <Input
                      type="checkbox"
                      onChange={() => {
                        handleInputRequiredChange(fieldIndex);
                      }}
                    />
                  </p>
                )}
                <Button onClick={() => handleRemoveField(fieldIndex)}>
                  Remove field
                </Button>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-sm items-center gap-1.5 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Add new input</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleNewInput("text")}>
                  Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNewInput("textarea")}>
                  Text Area
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNewInput("email")}>
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNewInput("password")}>
                  Password
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNewInput("checkbox")}>
                  Checkbox
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
