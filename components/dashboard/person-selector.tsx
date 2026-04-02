"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_PEOPLE = [
  { id: "1", name: "Anne Hathaway", role: "Actress" },
  { id: "2", name: "Christopher Nolan", role: "Director" },
  { id: "3", name: "Leonardo DiCaprio", role: "Actor" },
  { id: "4", name: "Margot Robbie", role: "Actress" },
  { id: "5", name: "Denis Villeneuve", role: "Director" },
  { id: "6", name: "Timothée Chalamet", role: "Actor" },
  { id: "7", name: "Florence Pugh", role: "Actress" },
  { id: "8", name: "Greta Gerwig", role: "Director" },
  { id: "9", name: "Cillian Murphy", role: "Actor" },
  { id: "10", name: "Zendaya", role: "Actress" },
];

export interface Person {
  id: string;
  name: string;
  role: string;
}

interface PersonSelectorProps {
  selectedPerson: Person | null;
  onSelectPerson: (person: Person | null) => void;
}

export function PersonSelector({
  selectedPerson,
  onSelectPerson,
}: PersonSelectorProps) {
  const [query, setQuery] = useState("");

  const filtered = MOCK_PEOPLE.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Select a Person
      </label>
      <p className="text-sm text-muted-foreground">
        Choose an actor, actress, or director to track their movies.
      </p>

      {selectedPerson ? (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{selectedPerson.name}</p>
            <Badge variant="secondary" className="mt-1">
              {selectedPerson.role}
            </Badge>
          </div>
          <button
            onClick={() => onSelectPerson(null)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove person</span>
          </button>
        </div>
      ) : (
        <Combobox
          value={null}
          onValueChange={(value) => {
            const person = MOCK_PEOPLE.find((p) => p.id === value);
            if (person) {
              onSelectPerson(person);
              setQuery("");
            }
          }}
        >
          <ComboboxInput
            placeholder="Search for a person..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxEmpty>No person found.</ComboboxEmpty>
              {filtered.map((person) => (
                <ComboboxItem key={person.id} value={person.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{person.name}</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      {person.role}
                    </Badge>
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      )}
    </div>
  );
}
