<!--
Copyright (C) 2025 The Qt Company Ltd.
SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only 
-->

<script lang="ts">
  import VerticalTabs from "@/comps/VerticalTabs.svelte";
  import {
    FolderOpenOutline,
    FileOutline,
    GridPlusOutline
  } from "flowbite-svelte-icons";
  import * as viewlogic from "./viewlogic.svelte";

  const items = [
    { label: "Project", icon: FolderOpenOutline, data: "project" },
    { label: "File", icon: FileOutline, data: "file" },
    { label: "Class", icon: GridPlusOutline, data: "class" },
  ];

  function onCurrentIndexChanged(i: number) {
    if (i >= 0 && i < items.length) {
      viewlogic.setPresetType(items[i].data);
    }
  }

</script>

<VerticalTabs {items} {onCurrentIndexChanged} />
