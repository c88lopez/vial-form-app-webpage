"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IForm } from "@/app/form/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Page() {
  const { id } = useParams();

  const [form, setForm] = useState<IForm | undefined>();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}`).then(
      (response) => {
        response.json().then((body) => {
          setForm(body.data);
        });
      },
    );
  }, []);

  function handleInputChange(fieldIndex: string, value: string) {
    const newAnswers = answers;

    newAnswers[fieldIndex] = value;

    setAnswers(newAnswers);
  }

  function onSubmit() {
    console.log("onSubmit", answers);

    fetch(
      `${process.env.NEXT_PUBLIC_VIAL_FORM_APP_API}/form/${id}/add-record`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          answers,
        }),
      },
    ).then((response) => {
      if (response.status === 200) {
        toast("Record added");
        return;
      }

      response.json().then((json) => {
        console.error(json.message);
      });
    });
  }

  return (
    <div className="p-3">
      {form && (
        <div>
          <h1 className="bold text-2xl">{form.name}</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {Object.keys(form.fields).map((fieldIndex) => {
              const field = form.fields[fieldIndex];

              return (
                <div
                  className="grid w-full max-w-sm items-center gap-1.5 py-3"
                  key={fieldIndex}
                >
                  {field.question}
                  {field.required && " *"}
                  <Input
                    type={field.type}
                    name={fieldIndex}
                    required={field.required}
                    onChange={(e) =>
                      handleInputChange(fieldIndex, e.target.value)
                    }
                  />
                </div>
              );
            })}

            <Button type={"submit"}>Add Record</Button>
          </form>
        </div>
      )}
    </div>
  );
}
